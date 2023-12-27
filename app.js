require('dotenv').config();
const path = require("path");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./Backend/util/database");
const userRouter = require("./Backend/routes/user");
const expenseRouter = require("./Backend/routes/expense");
const purchaseRouter = require("./Backend/routes/purchase");
const leaderboardRoute = require("./Backend/routes/leaderboard");

const User = require("./Backend/models/user");
const Expense = require("./Backend/models/expense");
const Order = require("./Backend/models/order");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(userRouter);
app.use(expenseRouter);
app.use(purchaseRouter);
app.use(leaderboardRoute);

User.hasMany(Expense); //One user can have many expenses
Expense.belongsTo(User); //But one expense belongs to only one user

User.hasMany(Order); //One user can have many orders
Order.belongsTo(User); //But one order belongs to only one user

async function startServer(){
    try{
        await sequelize.sync({force:false});
        app.listen(3000,()=>{
            console.log("Server is running")
        })
    }
    catch(err){console.log(err)};
}

startServer();