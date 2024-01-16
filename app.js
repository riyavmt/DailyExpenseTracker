require('dotenv').config();
const path = require("path");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Sib = require("sib-api-v3-sdk");

const sequelize = require("./Backend/util/database");
const userRouter = require("./Backend/routes/user");
const expenseRouter = require("./Backend/routes/expense");
const purchaseRouter = require("./Backend/routes/purchase");
const premiumRoute = require("./Backend/routes/premium");

const User = require("./Backend/models/user");
const Expense = require("./Backend/models/expense");
const Order = require("./Backend/models/order");
const ForgotPasswordRequest = require("./Backend/models/forgotPasswordRequests");
const DownloadLogs = require("./Backend/models/downloadlogs");
const { forgotPassword } = require('./Backend/controllers/user');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(userRouter);
app.use(expenseRouter);
app.use(purchaseRouter);
app.use(premiumRoute);

User.hasMany(Expense); //One user can have many expenses
Expense.belongsTo(User); //But one expense belongs to only one user

User.hasMany(Order); //One user can have many orders
Order.belongsTo(User); //But one order belongs to only one user

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(DownloadLogs); //One user can have many orders
DownloadLogs.belongsTo(User);
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