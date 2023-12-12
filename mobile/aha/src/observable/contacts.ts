import {makeAutoObservable} from 'mobx';

class Contacts {
  list: Contact[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  setContacts(contacts: Contact[]) {
    this.list = contacts;
  }
  addContact(contact: Contact) {
    this.list.push(contact);
  }
  removeContact(contact: string) {
    this.list = this.list.filter(c => c.name !== contact);
  }
  updateContact(newContact: Contact) {
    const contact = this.list.find(({id}) => id === newContact.id);
    if (contact) {
      this.list.splice(this.list.indexOf(contact), 1, newContact);
    }
  }
  setDHK(payload: {name: string; dhk: string}) {
    const contact = this.list.find(({name}) => name === payload.name);
    if (contact) {
      contact.dhk = payload.dhk;
    }
  }
  updateKey(payload: AddKeyPayload) {
    const contact = contacts.list.find(u => u.name === payload.contactName);
    if (contact) {
      contact.keys = contact
        .keys!.filter(k => k.type !== payload.key.type)
        .concat(payload.key);
    }
  }
}

const contacts = new Contacts();
export type ContactsProps = typeof contacts;
export default contacts;
