const { prisma } = require("../prisma/client");

async function createComment({ content, userId }) {
  return prisma.comment.create({
    data: {
      content,
      userId: userId ?? null
    },
    select: { id: true, content: true, userId: true, createdAt: true }
  });
}

async function listComments() {
  return prisma.comment.findMany({
    select: { id: true, content: true, userId: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });
}

module.exports = { createComment, listComments };
