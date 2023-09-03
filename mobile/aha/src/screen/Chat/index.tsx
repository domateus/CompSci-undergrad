import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, View} from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const Chat = ({route, navigation}: Props) => {
  return (
    <View>
      <Text>Chat</Text>
    </View>
  );
};

export default Chat;
