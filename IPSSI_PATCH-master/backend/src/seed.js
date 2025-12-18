const userService = require("./services/userService");
const commentService = require("./services/commentService");
const { prisma } = require("./prisma/client");

async function seedIfNeeded() {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("[seed] Users already exist, skipping.");
    return;
  }

  console.log("[seed] Creating demo users...");
  const alice = await userService.createUser({ name: "Alice", password: "password123" });
  const bob   = await userService.createUser({ name: "Bob",   password: "password123" });

  console.log("[seed] Creating demo comments...");
  await commentService.createComment({ content: "Bonjour 👋", userId: alice.id });
  await commentService.createComment({ content: "Un commentaire de test.", userId: bob.id });

  console.log("[seed] Done.");
}

module.exports = { seedIfNeeded };
