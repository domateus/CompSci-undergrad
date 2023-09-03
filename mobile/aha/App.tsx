import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {BigInteger} from 'jsbn';

import Home from './src/screen/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screen/Login';
import theme from './src/theme';
import Chat from './src/screen/Chat';
import {io} from 'socket.io-client';

const socket = io('http://fast-chamber-80133.herokuapp.com/');

function App(): JSX.Element {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const hasDSAKeysRef = useRef(false);

  useEffect(() => {
    socket.emit('hi');

    socket.on('psks', ({dh, dsa: DSA}) => {
      if (hasDSAKeysRef.current) {
        return;
      }
      hasDSAKeysRef.current = true;
      dispatch(
        sessionActions.setDHConstants({p: dh.p, q: dh.q, a: DH.secretKey()}),
      );
      const x = new BigInteger(
        window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
        16,
      );
      const y = new BigInteger(DSA.g, 16).modPow(x, new BigInteger(DSA.p, 16));
      dispatch(
        sessionActions.setDSAConstants({
          ...DSA,
          x: x.toString(16).padStart(256, '0'),
          y: y.toString(16).padStart(256, '0'),
        }),
      );
    });
    socket.on('users', users => {
      dispatch(contactsActions.set(users));
    });
    socket.on('new-user', newUser => {
      dispatch(contactsActions.push(newUser));
    });
    socket.on('user-disconnected', userToRemove => {
      dispatch(contactsActions.remove(userToRemove));
    });
    hasDefinedName && socket.emit('get-users', user);
    socket.on('disconnect', console.log);

    return () => {
      socket.off('users');
      socket.off('new-user');
      socket.off('user-disconnected');
      socket.off('disconnect');
      socket.off('dhpsk');
    };
  }, [dispatch, user, hasDefinedName]);
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={theme.COLORS.GRAY_700} />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={navigatorOptions}
        />
        <Stack.Screen name="Home" component={Home} options={navigatorOptions} />
        <Stack.Screen name="Chat" component={Chat} options={navigatorOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const navigatorOptions = {
  headerStyle: {
    backgroundColor: theme.COLORS.GRAY_700,
  },
  headerTitleStyle: {
    color: theme.COLORS.RED_DARK,
  },
};
