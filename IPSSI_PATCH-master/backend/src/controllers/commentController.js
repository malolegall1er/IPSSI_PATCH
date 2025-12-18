const commentService = require("../services/commentService");
const { isNonEmptyString, toInt } = require("../utils/validate");

async function listComments(req, res, next) {
  try {
    const comments = await commentService.listComments();
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

async function createComment(req, res, next) {
  try {
    const { content, userId } = req.body || {};
    if (!isNonEmptyString(content)) return res.status(400).json({ error: "Invalid content" });
    if (content.length > 1000) return res.status(413).json({ error: "Comment too large" });

    const id = userId === undefined || userId === null || userId === "" ? null : toInt(userId);
    if (userId !== undefined && userId !== null && userId !== "" && id === null) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const created = await commentService.createComment({ content: content.trim(), userId: id });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

module.exports = { listComments, createComment };
