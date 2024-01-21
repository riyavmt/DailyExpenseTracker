const path = require("path");
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const userAuthentication = require("../Middleware/auth");

router.post("/signup",userController.postSignup);
router.post("/login",userController.postLogin);

router.post('/forgotpassword',userController.forgotPassword);
router.get('/reset-password/:uuid',userController.resetPassword);
router.post('/updatePassword',userController.updatePassword);

module.exports = router;