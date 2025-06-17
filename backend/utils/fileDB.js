const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "../data/usuarios.json");

function readUsers() {
  const data = fs.readFileSync(file);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
}

function findUserByEmail(email) {
  const users = readUsers();
  return users.find((u) => u.email === email);
}

function updateUser(user) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  writeUsers(users);
}

module.exports = { readUsers, writeUsers, findUserByEmail, updateUser };
