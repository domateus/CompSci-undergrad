import {
  createHmac,
  generateKeyPairSync,
  privateDecrypt,
  privateEncrypt,
} from "crypto";
import fs from "fs";
import fetch from "node-fetch";

const passphrase = "pudim";
const format = "pem";
const server = "http://localhost:3000/";

// gera chaves assimetricas
const generateAsymmetricKeys = () => {
  return Object.freeze(
    generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format,
      },
      privateKeyEncoding: {
        cipher: "aes-256-cbc",
        type: "pkcs8",
        passphrase,
        format,
      },
    })
  );
};

const { privateKey, publicKey } = generateAsymmetricKeys(); // constroi chave assimetrica
// gera um usuário aleatório
const getUser = () => ({
  clientPublicKey: publicKey,
  username: `Mateus#${parseInt(Math.random() * 100)}`,
});

let serverPublicKey;
let serverSymmetricKey;

// função auxiliar para fazer requisições
const req = async (route, body) => {
  const res = await fetch(server + route, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
};

// envia chave publica ao servidor e recebe a chave publica do servidor
const greetings = async (me) => {
  const data = await req("greetings", me);
  // descriptografa a resposta do servidor com a chave privada do cliente
  const text = privateDecrypt(
    { key: privateKey, passphrase },
    Buffer.from(data.greeting)
  );
  // salva chave publica do servidor
  serverPublicKey = data.publicKey;
  console.log(text.toString("utf-8"));
};

// recebe chave simetrica do servidor
const hotStuff = async (me) => {
  const data = await req("hot-stuff", {
    username: me.username,
    text: privateEncrypt(
      { key: privateKey, passphrase },
      Buffer.from("symmetricKey")
    ),
  });

  // descriptografa a chave simetrica do servidor com a chave privada do cliente
  serverSymmetricKey = privateDecrypt(
    { key: privateKey, passphrase },
    Buffer.from(data.answer)
  );
  console.log(
    "hotstuff, symmetric key is: ",
    serverSymmetricKey.toString("hex")
  );
};

// usa canal de comunicação segura
const secureChannel = async () => {
  // le arquivo de texto local
  const text = fs.readFileSync("camoes.txt", "utf-8");
  const lines = text.split(/\r?\n/);
  try {
    // para cada linha envia uma requisição para o servidor
    for (let i = 0; i < lines.length; i++) {
      const hmac = createHmac("sha256", serverSymmetricKey);
      let line = lines[i];
      hmac.update(line);
      // gera um hash com a chave simetrica do texto lido
      const hash = hmac.digest("hex");
      // há uma chance de 15% de erro, só para fins ilustrativos
      // essa condicional modifica o texto enviado
      // então o hash gerado pelo servidor é diferente do hash gerado pelo cliente
      if (Math.random() < 0.15) line = "opa";
      const data = await req("secure-channel", { text: line, hash });
      console.log(data, i + 1);
    }
  } catch (e) {}
};

const go = async () => {
  // busca o usuario
  const me = getUser();
  console.log("me", me.username);
  // faz os cumprimentos com o servidor, aqui ocorre a troca de chaves publicas
  await greetings(me);
  // cliente e servidor usam a criptografia assimetrica para trocar chave simetrica
  // o servidor encripta a chave simetrica com a chave publica do cliente
  // e o cliente então usa sua chave privada para descriptografar a chave simétrica
  await hotStuff(me);
  // ao ter garantido a autenticidade do cliente, basta que o canal de comunicação
  // garanta a integridade da mensagem, então usando a criptografia simétrica
  await secureChannel();
};

// inicia o programa
await go();
