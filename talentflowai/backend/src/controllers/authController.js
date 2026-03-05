const bcrypt = require("bcryptjs");
const store = require("../models/store");
const { createToken } = require("../utils/authMiddleware");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email y password son requeridos" });
  }

  const existingUser = store.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ message: "El email ya está registrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: store.ids.user++,
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  store.users.push(user);
  store.profiles[user.id] = {
    userId: user.id,
    skills: [],
    yearsExperience: 0,
    expectedSalary: 0,
    location: "",
    modality: "",
    summary: ""
  };

  const token = createToken(user);

  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email y password son requeridos" });
  }

  const user = store.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = createToken(user);

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
}

module.exports = {
  register,
  login
};
