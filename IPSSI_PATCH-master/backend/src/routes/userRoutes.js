const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/users", userController.listUsers);
router.get("/users/:id", userController.getUser);
router.post("/users", userController.createUser);

module.exports = router;
