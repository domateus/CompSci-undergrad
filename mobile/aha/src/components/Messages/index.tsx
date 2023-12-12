import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Message from './message';
import {observer} from 'mobx-react-lite';
import messages from '../../observable/messages';
import session from '../../observable/session';

const Messages: React.FC = observer(() => {
  return (
    <ScrollView style={S.scrollView}>
      {(messages.list[session.userToChat] || []).map((message, i, self) => (
        <Message
          key={message.hash}
          message={message}
          isLast={i === self.length - 1}
        />
      ))}
    </ScrollView>
  );
});

export default Messages;

const S = StyleSheet.create({
  scrollView: {
    height: '95%',
  },
});
