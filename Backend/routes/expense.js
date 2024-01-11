const path = require("path");
const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expense");
const userAuthentication = require("../Middleware/auth");

router.post("/add-expense",userAuthentication.authenticate,expenseController.postAddExpense);
router.get("/add-expense",userAuthentication.authenticate,expenseController.getAddExpense);
router.delete("/delete-expense/:id",userAuthentication.authenticate,expenseController.deleteExpense);

module.exports = router;