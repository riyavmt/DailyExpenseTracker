const express = require('express');
const router = express.Router();

const leaderboardController = require("../controllers/leaderboard");

router.get("/show-leaderboard",leaderboardController.showLeaderboard);
module.exports = router;