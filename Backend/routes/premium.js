const express = require('express');
const router = express.Router();

const leaderboardController = require("../controllers/leaderboard");
const expenseController = require("../controllers/expense");

const userAuthentication = require("../Middleware/auth");

router.get("/show-leaderboard",leaderboardController.showLeaderboard);
// router.get("/download-expense",userAuthentication.authenticate,expenseController.downloadExpense);
// router.get("/show-downloads",userAuthentication.authenticate,expenseController.showDownloads);

module.exports = router;