import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import session from '../../observable/session';
import {observer} from 'mobx-react-lite';
import {styles} from '../../utils/page-style';
import ChatInput from '../../components/ChatInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = observer(({navigation}: Props) => {
  const [username, setUsername] = React.useState('');

  const handleNext = () => {
    session.setUser(username);
    navigation.navigate('Contacts', {username});
  };
  return (
    <View style={styles.container}>
      <Text style={styles.h4}>Pick your username</Text>
      <View style={styles.gap} />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        onSubmitEditing={handleNext}
      />
      <View style={styles.gap2} />
      <Pressable style={S.button} disabled={!username} onPress={handleNext}>
        <Text style={S.text}>Next</Text>
      </Pressable>
    </View>
  );
});

const S = StyleSheet.create({
  button: {
    backgroundColor: '#EF9335',
    padding: 4,
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default Login;
