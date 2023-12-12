// @ts-nocheck
import {useMemo, useState} from 'react';
import {Tooltip} from '@rneui/themed';
import React from 'react';
import {observer} from 'mobx-react-lite';
import session from '../../observable/session';
import {Image, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import {styles} from '../../utils/page-style';
const TextMessage: React.FC<{
  message: Message<TextPayload>;
  isLast: boolean;
}> = observer(({message, isLast}) => {
  const align = message.from === session.user ? 'right' : 'left';
  const shieldLock = <Icon name="shield-lock" size={20} color="#fff" />;
  const [visible, setVisible] = useState(false);

  message?.images?.length &&
    console.log('hasImage', message.images[0].src.length);
  const encryptionInfo = useMemo(
    () => (
      <>
        <View style={styles.gapX} />
        <Tooltip
          visible={visible}
          withOverlay={false}
          skipAndroidStatusBar
          onOpen={() => {
            setVisible(true);
          }}
          onClose={() => {
            setVisible(false);
          }}
          containerStyle={{padding: 0, height: 'fit-content'}}
          popover={
            <>
              <Text>
                <Text style={{fontWeight: 'bold'}}>encryption: </Text>
                {message.payload.encryption}
              </Text>
              {message.from !== session.user && (
                <>
                  <View style={{height: 2}} />
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>hash match: </Text>
                    {message.hashVerified ? 'true' : 'false'}
                  </Text>
                  <View style={{height: 2}} />
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>signature match: </Text>
                    {message.signatureVerified ? 'true' : 'false'}
                  </Text>
                </>
              )}
              <View style={{paddingHorizontal: 0.1}} />
            </>
          }>
          {shieldLock}
        </Tooltip>
        <View style={styles.gapX} />
      </>
    ),
    [visible],
  );

  return (
    <View style={S.MessageContainer(align)}>
      {align === 'right' && encryptionInfo}
      <View style={S.Message(align)}>
        <Text>{message.payload.text}</Text>
        {(message?.images || []).length > 0 && (
          <View style={S.ImagesContainer}>
            {(message?.images || []).map(image => (
              <Image height={100} width={100} source={{uri: image.src}} />
            ))}
          </View>
        )}
      </View>
      {align === 'left' && encryptionInfo}
    </View>
  );
});

export default TextMessage;

const S = StyleSheet.create({
  MessageContainer: (align: 'left' | 'right') => ({
    display: 'flex',
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
    alignItems: 'center',
    position: 'relative',
  }),
  Message: (align: 'left' | 'right', last: boolean) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: align === 'left' ? 'flex-start' : 'flex-end',
    maxWidth: '80%',
    backgroundColor: '#fff',
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  }),
  ImagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});
