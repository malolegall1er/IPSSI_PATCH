const { app } = require("./app");
const { prisma } = require("./prisma/client");
const { seedIfNeeded } = require("./seed");

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const SEED_ON_START = (process.env.SEED_ON_START || "true").toLowerCase() === "true";

async function main() {
  // DB connectivity check
  await prisma.$queryRaw`SELECT 1`;

  if (SEED_ON_START) {
    await seedIfNeeded();
  }

  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}

main().catch((e) => {
  console.error("Startup error:", e);
  process.exit(1);
});
