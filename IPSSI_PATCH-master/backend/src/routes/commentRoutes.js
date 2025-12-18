const { Router } = require("express");
const commentController = require("../controllers/commentController");

const router = Router();

router.get("/comments", commentController.listComments);
router.post("/comments", commentController.createComment);

module.exports = router;
