const express = require("express");
const router = express.Router();
const { updateUser } = require("../controllers/authController");

router.put("/:id", updateUser);

module.exports = router;
