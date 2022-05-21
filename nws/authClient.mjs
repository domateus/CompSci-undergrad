import {
  createHmac,
  generateKeyPairSync,
  privateDecrypt,
  privateEncrypt,
  publicDecrypt,
} from "crypto";
import fs from "fs";
import fetch from "node-fetch";

const passphrase = "pudim";
const format = "pem";
const server = "http://localhost:3000/";

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

const { privateKey, publicKey } = generateAsymmetricKeys();
const getUser = () => ({
  clientPublicKey: publicKey,
  username: `Mateus#${parseInt(Math.random() * 100)}`,
});
let serverPublicKey;
let serverSymmetricKey;
const req = async (route, body) => {
  const res = await fetch(server + route, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
};
const greetings = async (me) => {
  const data = await req("greetings", me);
  const text = privateDecrypt(
    { key: privateKey, passphrase },
    Buffer.from(data.greeting)
  );
  serverPublicKey = data.publicKey;
  console.log(text.toString("utf-8"));
};

const hotStuff = async (me) => {
  const data = await req("hot-stuff", {
    username: me.username,
    text: privateEncrypt(
      { key: privateKey, passphrase },
      Buffer.from("symmetricKey")
    ),
  });

  serverSymmetricKey = publicDecrypt(serverPublicKey, Buffer.from(data.answer));
  console.log(
    "hotstuff, symmetric key is: ",
    serverSymmetricKey.toString("hex")
  );
};

const secureChannel = async (fail = false) => {
  const text = fs.readFileSync("camoes.txt", "utf-8");
  const lines = text.split(/\r?\n/);
  try {
    for (let i = 0; i < lines.length; i++) {
      const hmac = createHmac("sha256", serverSymmetricKey);
      let line = lines[i];
      hmac.update(line);
      const hash = hmac.digest("hex");
      if (Math.random() < 0.15) line = "opa";
      const data = await req("secure-channel", { text: line, hash });
      console.log(data, i + 1);
    }
  } catch (e) {}
};

const go = async () => {
  const me = getUser();
  console.log("me", me.username);
  await greetings(me);
  await hotStuff(me);
  await secureChannel();
};

await go();
