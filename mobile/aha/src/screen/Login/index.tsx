import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import theme from '../../theme';
import contacts from '../../observable/contacts';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({navigation}: Props) => {
  const [username, setUsername] = React.useState('');

  const handleNext = () => {
    navigation.navigate('Home', {username});
  };
  return (
    <View style={styles.container}>
      <Button
        title="addContact"
        onPress={() =>
          contacts.addContact({name: 'asdf', id: Math.random() * 100})
        }
      />
      <Text style={styles.h4}>Pick your username</Text>
      <View style={styles.gap} />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        onSubmitEditing={handleNext}
      />
      <View style={styles.gap2} />
      <Button title="Next" disabled={!username} onPress={handleNext} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.GRAY_700,
    height: '100%',
    color: theme.COLORS.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  gap: {
    height: 20,
  },
  gap2: {
    height: 40,
  },
  input: {
    backgroundColor: theme.COLORS.GRAY_100,
    opacity: 0.6,
    margin: 1,
    borderRadius: 5,
    padding: 2,
    paddingVertical: 0,
    fontSize: theme.FONT_SIZE.MD,
    fontWeight: 'bold',
    color: theme.COLORS.GREEN_500,
  },
  h4: {
    fontSize: theme.FONT_SIZE.LG,
    fontWeight: 'bold',
    color: theme.COLORS.WHITE,
  },
});
