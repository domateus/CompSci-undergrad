import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import theme from '../../theme';
import ContactList from '../../components/ContactList';
import contacts from '../../observable/contacts';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({route, navigation}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.h4}>Hi, {route.params.username}</Text>
      <View style={styles.gap2} />
      <ContactList contacts={contacts} />
    </View>
  );
}

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
