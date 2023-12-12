import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {BigInteger} from 'jsbn';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screen/Login';
import theme from './src/theme';
import Chat from './src/screen/Chat';
import session from './src/observable/session';
import contacts from './src/observable/contacts';
import * as DH from './src/cipher/diffieHellman';
import {observer} from 'mobx-react-lite';
import 'react-native-get-random-values';
import Contacts from './src/screen/Contacts'; // necessary for global.crypto.getRandomValues

const App = observer(() => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    if (!session.socket) {
      return;
    }
    session.socket.emit('hi');
    session.socket.on(
      'psks',
      ({dh, dsa}: {dh: DHContants; dsa: DSAContants}) => {
        session.setDHConstants({p: dh.p, q: dh.q, a: DH.secretKey()});

        const x = new BigInteger(
          global.crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
          16,
        );
        const y = new BigInteger(dsa.g, 16).modPow(
          x,
          new BigInteger(dsa.p, 16),
        );
        session.setDSAConstants({
          ...dsa,
          x: x.toString(16).padStart(256, '0'),
          y: y.toString(16).padStart(256, '0'),
        });
      },
    );
    session.socket.on('users', users => {
      contacts.setContacts(users);
    });
    session.socket.on('new-user', newUser => {
      contacts.addContact(newUser);
    });
    session.socket.on('user-disconnected', userToRemove => {
      contacts.removeContact(userToRemove);
    });
    session.socket.on('disconnect', console.log);

    return () => {
      if (session.socket) {
        session.socket.off('users');
        session.socket.off('new-user');
        session.socket.off('user-disconnected');
        session.socket.off('disconnect');
        session.socket.off('dhpsk');
      }
    };
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={theme.COLORS.DARK} />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={navigatorOptions}
        />
        <Stack.Screen
          name="Contacts"
          component={Contacts}
          options={navigatorOptions}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{...navigatorOptions, title: session.userToChat}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default App;

const navigatorOptions = {
  headerStyle: {
    backgroundColor: theme.COLORS.DARK,
  },
  headerTitleStyle: {
    color: theme.COLORS.WHITE,
  },
  headerTintColor: theme.COLORS.WHITE,
};
