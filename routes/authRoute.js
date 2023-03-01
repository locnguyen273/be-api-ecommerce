const express = require("express");
const {
  createUser,
  loginUser,
  getAllUser,
  getUserById,
  deleteUser,
  updateInformationUser
} = require("../controller/userController");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/get-all-user", getAllUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.put("/:id", updateInformationUser);

module.exports = router;
