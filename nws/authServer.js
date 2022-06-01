const {
  privateEncrypt,
  publicDecrypt,
  generateKeyPairSync,
  publicEncrypt,
  scryptSync,
  createHmac,
} = require("crypto");
const express = require("express");

const passphrase = "pudim";
const format = "pem";
const users = [];

// gera chave assimetrica
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

// gera chave simetrica
const generateSymmetricKey = () =>
  scryptSync(passphrase, "salt", 64, { encoding: "hex" });

// salva usuário e criptografa uma mensagem com a chave publica do cliente
const buildGreetingWithPublicKey = ({ clientPublicKey, username }) => {
  users.push({ clientPublicKey, username });
  return publicEncrypt(clientPublicKey, Buffer.from("hi"));
};

const { privateKey, publicKey } = generateAsymmetricKeys(); // constroi chave assimetrica
const symmetricKey = generateSymmetricKey(); // constroi chave simetrica

// constroi servidor
const app = express();
app.use(express.json());

// rota para recerber chave publica do cliente
// responde com a chave publica do servidor
app.post("/greetings", (req, res) => {
  const greeting = buildGreetingWithPublicKey(req.body);
  console.log([req.body.username]);
  res.json({ greeting, publicKey });
});

// rota para encaminhar a chave simetrica
app.post("/hot-stuff", (req, res) => {
  const { text, username } = req.body;
  // busca qual cliente esta mandando mensagem
  const clientPublicKey = users.find(
    (u) => u.username === username
  ).clientPublicKey;
  //descriptograva a mensagem enviada pelo cliente com a sua chave publica
  const inNeed = publicDecrypt(clientPublicKey, Buffer.from(text)).toString(
    "utf-8"
  );
  let answer = "bye";
  // se a mensagem do cliente for "symmetricKey" responde com a chave simetrica
  if (inNeed === "symmetricKey") {
    answer = publicEncrypt(clientPublicKey, Buffer.from(symmetricKey));
  }
  res.json({ answer });
});

// canal de comunicação com criptografia simetrica
app.post("/secure-channel", (req, res) => {
  const { text, hash } = req.body;
  const hmac = createHmac("sha256", symmetricKey);
  // faz o hash do texto recebido do cliente
  hmac.update(text);
  let answer = "compromised";
  // se o hash for igual ao hash recebido pelo cliente responde com "ok"
  if (hmac.digest("hex") == hash) {
    console.log(text);
    answer = "alles gut";
  }
  res.json({ answer });
});

app.listen(3000, (_) => {
  console.log("running");
});
