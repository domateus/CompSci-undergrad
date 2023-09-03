import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {Socket} from 'socket.io-client';
import {ContactsProps} from '../../observable/contacts';

type ContactListProps = {
  contacts: ContactsProps;
  socket?: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const ContactList = observer(({contacts}: ContactListProps) => {
  if (!contacts.list.length) {
    return <EmptyContactList />;
  }

  return contacts.list.map(contact => (
    <View key={contact.id}>
      <Text>{contact.name}</Text>
    </View>
  ));
});

export default ContactList;

function EmptyContactList() {
  return (
    <View>
      <Text>No contacts</Text>
    </View>
  );
}
