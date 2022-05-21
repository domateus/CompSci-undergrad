const {
  privateEncrypt,
  publicDecrypt,
  privateDecrypt,
  generateKeyPairSync,
  publicEncrypt,
  scryptSync,
  createHmac,
} = require("crypto");
const express = require("express");

const passphrase = "pudim";
const format = "pem";
const users = [];
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

const generateSymmetricKey = () => {
  return scryptSync(passphrase, "salt", 64, { encoding: "hex" });
};

const buildGreetingWithPublicKey = ({ clientPublicKey, username }) => {
  users.push({ clientPublicKey, username });
  return publicEncrypt(clientPublicKey, Buffer.from("hi"));
};

const { privateKey, publicKey } = generateAsymmetricKeys();
const symmetricKey = generateSymmetricKey();
const app = express();
app.use(express.json());

app.post("/greetings", (req, res) => {
  const greeting = buildGreetingWithPublicKey(req.body);
  console.log([req.body.username]);
  res.json({ greeting, publicKey });
});

app.post("/hot-stuff", (req, res) => {
  const { text, username } = req.body;
  const clientPublicKey = users.find(
    (u) => u.username === username
  ).clientPublicKey;
  const inNeed = publicDecrypt(clientPublicKey, Buffer.from(text)).toString(
    "utf-8"
  );
  let answer = "bye";
  if (inNeed === "symmetricKey") {
    answer = privateEncrypt(
      { key: privateKey, passphrase },
      Buffer.from(symmetricKey)
    );
  }
  res.json({ answer });
});

app.post("/secure-channel", (req, res) => {
  const { text, hash } = req.body;
  const hmac = createHmac("sha256", symmetricKey);
  hmac.update(text);
  let answer = "compromised";
  if (hmac.digest("hex") == hash) {
    console.log(text);
    answer = "alles gut";
  }
  res.json({ answer });
});

app.listen(3000, (_) => {
  console.log("running");
});
