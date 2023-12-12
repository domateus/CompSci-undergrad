import {makeAutoObservable} from 'mobx';

class Messages {
  list: {[key: string]: Message<TextPayload>[]} = {};
  constructor() {
    makeAutoObservable(this);
  }
  push(message: Message<TextPayload>, channel: string) {
    console.log('pushing message', message);
    console.log('to channel', channel);
    if (!this.list[channel]) {
      this.list[channel] = [];
    }
    this.list[channel].push(message);
  }
}

const messages = new Messages();
export type MessagesProps = typeof messages;
export default messages;
