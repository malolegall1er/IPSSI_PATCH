const bcrypt = require("bcrypt");
const { prisma } = require("../prisma/client");

const SALT_ROUNDS = 12;

async function createUser({ name, password }) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: { name, password: hashed },
    select: { id: true, name: true, createdAt: true }
  });
}

async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, createdAt: true },
    orderBy: { id: "asc" }
  });
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, createdAt: true }
  });
}

module.exports = { createUser, listUsers, getUserById };
