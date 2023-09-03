import {makeAutoObservable} from 'mobx';

class Contacts {
  list: Contact[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  addContact(contact: Contact) {
    this.list.push(contact);
  }
  removeContact(contact: Contact) {
    this.list = this.list.filter(c => c !== contact);
  }
  updateContact(newContact: Contact) {
    const contact = this.list.find(({id}) => id === newContact.id);
    if (contact) {
      this.list.splice(this.list.indexOf(contact), 1, newContact);
    }
  }
}

const contacts = new Contacts();
export type ContactsProps = typeof contacts;
export default contacts;
