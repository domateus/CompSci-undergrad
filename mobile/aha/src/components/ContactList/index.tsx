import {observer} from 'mobx-react-lite';
import React from 'react';
import {Text, View} from 'react-native';
import contacts from '../../observable/contacts';
import Contact from '../Contact';

const ContactList = observer(() => {
  return contacts.list.map(contact => (
    <View key={contact.id}>
      <Contact contact={contact} />
    </View>
  ));
});

export default ContactList;
