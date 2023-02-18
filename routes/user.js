const express = require('express');
const { registerUser, loginUser } = require("../controllers/user");
const {body, check} = require('express-validator');
const router = express.Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email"),
  body("name").notEmpty().withMessage("Name is Empty."),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password should be at least of 5 character"),
  registerUser
);
router.post("/login", loginUser);
module.exports = router;