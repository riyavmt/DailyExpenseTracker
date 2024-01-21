const express = require('express');
const router = express.Router();
const purchaseController = require("../controllers/purchase");
const userAuthentication = require("../Middleware/auth");


router.get("/buy-premium",userAuthentication.authenticate,purchaseController.getBuyPremium);
router.post("/updateTransactionStatus",userAuthentication.authenticate,purchaseController.postupdateTransaction);

module.exports = router;