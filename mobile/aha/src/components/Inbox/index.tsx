import React, {useCallback, useEffect} from 'react';
import {View} from 'react-native';
import Messages from '../Messages';
import ChatInput from '../ChatInput';
import {observer} from 'mobx-react-lite';
import * as AES from '../../cipher/aes';
import * as DH from '../../cipher/diffieHellman';
import * as DSA from '../../cipher/dsa';
import {sha512} from '../../cipher/sha';
import {asciiToHex} from '../../cipher/utils';
import session from '../../observable/session';
import contacts from '../../observable/contacts';
import messages from '../../observable/messages';
import {
  contactValidKey,
  generateKey,
  getCiphertext,
  getPlaintext,
  isKeyValid,
  uuidv4,
} from '../../utils';

const Inbox = observer(() => {
  const sendMessage = ({
    text,
    encryption,
    images,
  }: {
    text: string;
    encryption: EncryptionAlgorithm;
    images: {src: string; id: string}[];
  }) => {
    if (!session.socket || !session.user) return;
    const contact = contacts.list.find(c => c.name === session.userToChat);
    if (!contact) return;

    let key = contactValidKey({algorithm: encryption, contact});
    if (encryption === 'AES' && key) {
      key.value = contact.dhk!;
    }

    let newMessage: Message<Partial<TextPayload>> = {
      id: uuidv4(),
      from: session.user,
      to: session.userToChat,
      timestamp: Date.now(),
      payload: {
        type: 'MESSAGE',
        encryption,
      },
      images: images.map(i => {
        const newUrl = AES.ecbEncryption({
          key: contact.dhk!,
          plaintext: asciiToHex(i.src),
        });
        const padding = i.src.length;
        console.log('encrypted img', newUrl, i);
        return {
          id: i.id,
          src: newUrl,
          padding,
        };
      }),
    };

    if (!isKeyValid(key)) {
      const newValue = generateKey({algorithm: encryption, message: text});
      newMessage = {
        ...newMessage,
        payload: {
          ...newMessage.payload,
          key: {
            value: newValue,
            type: encryption,
            timestamp: Date.now(),
            version: key?.version ? key.version + 1 : 1,
          },
        },
      };
      const ciphertext = getCiphertext({
        key: newMessage.payload.key!.value,
        plaintext: text,
        algorithm: encryption,
      });
      console.log('ciphertext', ciphertext);
      console.log('original', text);

      const padding = 32 - (newValue.length % 32);
      const encryptedKey = AES.ecbEncryption({
        plaintext: newMessage.payload.key!.value,
        key: contact.dhk!,
      });
      console.log('encryptedKey', encryptedKey);
      console.log('padding', padding);
      console.log('key value', newMessage.payload.key!.value);
      newMessage = {
        ...newMessage,
        payload: {
          ...newMessage.payload,
          padding,
          text: ciphertext,
          key: {
            ...(newMessage.payload!.key as AlgorithmKey),
            value: encryptedKey,
          },
        },
      };
      if (encryption !== 'OTP') {
        contacts.updateKey({
          contactName: session.userToChat,
          key: {
            ...(newMessage.payload!.key as AlgorithmKey),
            value: newValue,
          },
        });
      }
    } else {
      const ciphertext = getCiphertext({
        key: key!.value!,
        plaintext: text,
        algorithm: encryption,
      });
      newMessage = {
        ...newMessage,
        payload: {
          ...newMessage.payload,
          text: ciphertext,
        },
      };
    }

    newMessage.hash = sha512(asciiToHex(JSON.stringify(newMessage)));
    newMessage.signature = DSA.sign({
      m: newMessage.hash,
      k: global.crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
      p: session.dsa.p,
      q: session.dsa.q,
      x: session.dsa.x,
      g: session.dsa.g,
    });

    messages.push(
      {
        ...(newMessage as Message<TextPayload>),
        payload: {
          ...(newMessage.payload as TextPayload),
          text,
        },
        images: images.map(i => {
          return {
            id: i.id,
            src: i.src,
            padding: 0,
          };
        }),
      },
      session.userToChat,
    );
    session.socket.emit('send-message', newMessage);
  };

  const handleTextMessage = useCallback(
    (message: Message<TextPayload>) => {
      const receivedFrom = contacts.list.find(c => c.name === message.from);
      if (!receivedFrom) return;
      const [r, s] = [...message!.signature!];
      const cloneMessage = {...message};
      delete cloneMessage.hash;
      delete cloneMessage.signature;

      const hash = sha512(asciiToHex(JSON.stringify(cloneMessage)));
      message.signatureVerified = DSA.verify({
        m: hash,
        s,
        y: receivedFrom.dsak!,
        p: session.dsa.p,
        q: session.dsa.q,
        g: session.dsa.g,
        r,
      });
      message.hashVerified = message.hash === hash;
      message.images = (message?.images || []).map(i => {
        let newUrl = AES.ecbDecryption({
          key: receivedFrom.dhk!,
          ciphertext: i.src,
        });
        if (i.padding) {
          newUrl = newUrl.slice(0, i.padding);
        }

        return {
          ...i,
          src: newUrl,
        };
      });

      let key = contactValidKey({
        contact: receivedFrom,
        algorithm: message.payload.encryption,
      });

      const refreshKey = () => {
        let decryptedKey = asciiToHex(
          AES.ecbDecryption({
            ciphertext: message.payload.key!.value,
            key: receivedFrom.dhk!,
          }),
        );
        console.log('decryptedKey', decryptedKey);
        if (message.payload.padding) {
          decryptedKey = decryptedKey.slice(0, -message.payload.padding);
        }
        message.payload.key!.value = decryptedKey;
        if (message.payload.encryption !== 'OTP') {
          contacts.updateKey({
            contactName: message.from,
            key: {
              ...(message.payload.key as AlgorithmKey),
              value: decryptedKey,
            },
          });
        }
      };

      if (!isKeyValid(key) || message.payload.encryption === 'OTP') {
        refreshKey();
      } else if (
        message.payload.key &&
        key &&
        (message.payload.key.version > key.version ||
          message.payload.key.timestamp > key.timestamp)
      ) {
        // when timestamps are different, means that both users have different keys
        // so we will use the one with the latest timestamp
        refreshKey();
      }

      const decryptionKey =
        ((key?.value && message.payload.encryption) === 'RSA' // if using RSA
          ? session.rsa.privateKey
          : message.payload.encryption === 'AES' // if using AES
          ? receivedFrom.dhk!
          : key?.value) ?? message!.payload!.key!.value; // else

      const text = getPlaintext({
        algorithm: message.payload.encryption,
        message: message.payload.text,
        key: decryptionKey,
      });

      const aha = {
        ...message,
        payload: {
          ...message.payload,
          text,
        },
      };
      console.log('***', messages);
      messages?.push(aha, message.from);
    },
    [contacts, session.rsa.privateKey, session.userToChat, messages],
  );

  const handleDHPSK = useCallback(
    (message: Message<DHPSKPayload>) => {
      if (message.payload.A) {
        session.socket!.emit('send-message', {
          id: uuidv4(),
          from: session.user,
          to: message.from,
          timestamp: Date.now(),
          payload: {
            type: 'DHPSK',
            B: DH.dh({p: session.dh.p, e: session.dh.a, b: session.dh.q}),
          },
        });

        const dhk = DH.dh({
          p: session.dh.p,
          e: session.dh.a,
          b: message.payload.A,
        });
        contacts.setDHK({dhk, name: message.from});
      } else if (message.payload.B) {
        const dhk = DH.dh({
          p: session.dh.p,
          e: session.dh.a,
          b: message.payload.B,
        });
        contacts.setDHK({dhk, name: message.from});
      }
    },
    [session.dh.a, session.dh.p, session.dh.q, session.socket, session.user],
  );

  useEffect(() => {
    session.socket!.on('receive-message', (message: Message) => {
      if (message.payload.type === 'MESSAGE') {
        handleTextMessage(message as Message<TextPayload>);
      } else if (message.payload.type === 'DHPSK') {
        handleDHPSK(message as Message<DHPSKPayload>);
      }
    });
    return () => {
      session.socket!.off('receive-message');
    };
  }, [session.socket, handleTextMessage, handleDHPSK]);
  return (
    <View>
      <Messages />
      <ChatInput sendMessage={sendMessage} />
    </View>
  );
});

export default Inbox;
