const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const saltRounds = 6;
const users = [];
app.post("/auth", (req, res) => {
  const { username } = req.body;
  users.push({ username });
  bcrypt.hash(username, saltRounds, (err, jwt) => {
    res.json({ jwt });
  });
});
app.get("/who-am-i", async (req, res) => {
  const { jwt } = req.headers;
  let foundUser = "you are nobody";
  for (let i = 0; i < users.length; i++) {
    const { username } = users[i];
    const thatsMe = await bcrypt.compare(username, jwt);
    if (thatsMe) foundUser = username;
  }
  res.json({ answer: foundUser });
});
app.listen(3000);
