import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import Inbox from '../../components/Inbox';
import {styles} from '../../utils/page-style';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';
type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const Chat = observer(({}: Props) => {
  return (
    <View style={styles.container}>
      <Inbox />
    </View>
  );
});

export default Chat;
