import React from 'react';
import {observer} from 'mobx-react-lite';
import session from '../../observable/session';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {uuidv4} from '../../utils';
import * as DH from '../../cipher/diffieHellman';
import {useAppNavigation} from '../../hooks';
import theme from '../../theme';
import Icon from 'react-native-vector-icons/Feather';
import {styles} from '../../utils/page-style';

const Contact = observer(({contact}: {contact: Contact}) => {
  const navigation = useAppNavigation();
  const messageIcon = <Icon name={'message-square'} size={20} color={'#fff'} />;
  return (
    <TouchableOpacity
      onPress={() => {
        if (!contact?.dhk) {
          const keyExchange: Message<DHPSKPayload> = {
            from: session.user,
            to: contact.name,
            id: uuidv4(),
            timestamp: Date.now(),
            payload: {
              type: 'DHPSK',
              A: DH.dh({p: session.dh.p, b: session.dh.q, e: session.dh.a}),
            },
          };
          session?.socket && session.socket.emit('send-message', keyExchange);
        }
        session.setUserToChat(contact.name);
        navigation.navigate('Chat');
      }}>
      <View style={S.container}>
        <Text style={S.contact}>{contact.name}</Text>
        <View style={styles.gapX} />
        {messageIcon}
      </View>
    </TouchableOpacity>
  );
});

export default Contact;

const S = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contact: {
    color: theme.COLORS.ORANGE_2,
    fontWeight: 'bold',
    fontSize: theme.SIZE.XL,
  },
});
