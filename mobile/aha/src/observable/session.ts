import {makeAutoObservable} from 'mobx';
import {Socket, io} from 'socket.io-client';
import * as rsa from '../cipher/rsa';
type bruh = {[x: string]: (object?: any) => void};
class Session {
  user = '';
  userToChat = '';
  theme = 'dark';
  hasDefinedName = false;
  socket: Socket<bruh, bruh> | undefined;
  rsa = {
    publicKey: '',
    privateKey: '',
  };
  dh = {p: '', q: '', a: ''};
  dsa = {p: '', q: '', g: '', x: '', y: ''};
  constructor() {
    makeAutoObservable(this);
    console.log("connecting to socket")
    this.socket = io('ws://10.0.2.2:8000/');
  }
  setUser(user: string) {
    this.rsa = rsa.parseKeys(rsa.generateKeys());
    this.user = user;
    this.socket?.emit('add', {user, publicKey: this.rsa.publicKey, dsak: this.dsa.y});
  }
  setUserToChat(user: string) {
    this.userToChat = user;
  }
  defineName() {
    this.hasDefinedName = true;
  }
  setDHConstants({p, q, a}: DHContants) {
    this.dh = {p, q, a};
  }
  setDSAConstants({p, q, g, x, y}: DSAContants) {
    this.dsa = {p, q, g, x, y};
  }
  setRSAKeys({publicKey, privateKey}: {publicKey: string; privateKey: string}) {
    this.rsa = {publicKey, privateKey};
  }
}

const session = new Session();
export type SessionProps = typeof session;
export default session;
