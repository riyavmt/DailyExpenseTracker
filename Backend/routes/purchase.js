const express = require('express');
const router = express.Router();
const purchaseController = require("../controllers/purchase");
const userAuthentication = require("../Middleware/auth");


router.get("/purchase/buy-premium",userAuthentication.authenticate,purchaseController.getBuyPremium);
router.post("/purchase/updateTransactionStatus",userAuthentication.authenticate,purchaseController.postupdateTransaction);

module.exports = router;