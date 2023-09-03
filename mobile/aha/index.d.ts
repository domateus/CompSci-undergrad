type RootStackParamList = {
  Home: {username: string};
  Login: undefined;
  Chat: undefined;
};

type DefaultEventsMap = Record<string, () => void>;

type Message<T = MessagePayloadTypes> = {
  id: string;
  from: string;
  to: string;
  timestamp: number;
  payload: T;
  images?: {
    id: string;
    src: string;
    padding: number;
  }[];
  hash?: string;
  hashVerified?: boolean;
  signature?: string[];
  signatureVerified?: boolean;
};

type MessagePayloadTypes = TextPayload | DHPSKPayload;

type EncryptionAlgorithm =
  | 'Caesar cipher'
  | 'Monoalphabetic'
  | 'Polyalphabetic'
  | 'Hill cipher'
  | 'Playfair'
  | 'OTP'
  | 'Rail fence'
  | 'Columnar'
  | 'DES'
  | 'AES'
  | 'RC4'
  | 'RSA'
  | 'ECC';

type TextPayload = {
  type: 'MESSAGE';
  text: string;
  encryption: EncryptionAlgorithm;
  key?: AlgorithmKey;
  padding?: number;
};

type DHPSKPayload = {
  type: 'DHPSK';
  A?: string;
  B?: string;
};

type Contact = {
  id?: number;
  name?: string;
  hasUnreadMessages?: boolean;
  canScrollToNewMessages?: boolean;
  keys?: AlgorithmKey[];
  publicKey?: string;
  dhk?: string;
  dsak?: string;
};

type AlgorithmKey = {
  version: number;
  timestamp: number;
  value: string;
  type: EncryptionAlgorithm;
};

type AddKeyPayload = {
  contactName: name;
  key: AlgorithmKey;
};

type EncryptPayload = {
  plaintext: string;
  key: string;
};

type DecryptPayload = {
  ciphertext: string;
  key: string;
};

type GenerateKeyPayload = {
  algorithm?: EncryptionAlgorithm;
  message: string;
  contact?: Contact;
};

type DecryptMessagePayload = {
  algorithm?: EncryptionAlgorithm;
  message: string;
  key?: string;
};

type EncryptMessagePayload = {
  algorithm?: EncryptionAlgorithm;
  plaintext: string;
  key: string;
};

type AsyncRandomKeyGenerator = () => Promise<string[]>;
type DHModPowPayload = {b: string; e: string; p: string};
type DHModPow = (payload: DHModPowPayload) => string;

type Encrypter = (payload: EncryptPayload) => string;

type Decrypter = (payload: DecryptPayload) => string;

type KeyGenerator = (payload: GenerateKeyPayload) => string;

type RandomKeyGenerator = () => string;
type DHContants = {
  p: string;
  q: string;
  a: string;
};
type DSAContants = {
  p: string;
  q: string;
  g: string;
  x: string;
  y: string;
};

type PlayfairKeyMatrixGeneratorPayload = {key: string};

type KeyPair = {
  publicKey: bigint[];
  privateKey: bigint[];
};

type ColumnarKeyGeneratorPayload = {key: string};

type ColumnarKeyGenerator = (payload: ColumnarKeyGeneratorPayload) => number[];
type PlayfairKeyMatrixGenerator = (
  payload: PlayfairKeyMatrixGeneratorPayload,
) => string[][];
