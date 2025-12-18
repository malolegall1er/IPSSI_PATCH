const { prisma } = require("./prisma/client");
const { seedIfNeeded } = require("./seed");

seedIfNeeded()
  .catch((e) => {
    console.error("[seed] Failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
