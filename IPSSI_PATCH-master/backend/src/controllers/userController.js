const userService = require("../services/userService");
const { isNonEmptyString, toInt } = require("../utils/validate");

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const id = toInt(req.params.id);
    if (id === null) return res.status(400).json({ error: "Invalid user id" });

    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, password } = req.body || {};
    if (!isNonEmptyString(name)) return res.status(400).json({ error: "Invalid name" });
    if (!isNonEmptyString(password) || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const created = await userService.createUser({ name: name.trim(), password });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, createUser };
