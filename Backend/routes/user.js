const path = require("path");
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.post("/signup",userController.postSignup);
router.post("/login",userController.postLogin);

router.post('/password/forgotpassword',userController.forgotPassword);

module.exports = router;