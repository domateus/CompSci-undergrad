import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import theme from '../../theme';
import ContactList from '../../components/ContactList';
import contacts from '../../observable/contacts';
import {styles} from '../../utils/page-style';

type Props = NativeStackScreenProps<RootStackParamList, 'Contacts'>;

export default function Contacts({route}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.gap2} />
      <ContactList />
    </View>
  );
}
