const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DownloadLogs = new Schema({
    fileUrl:{
        type:String
    },
    date:{
        type:String
    }
});
module.exports = mongoose.model("DownloadLogs",DownloadLogs)



// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const DownloadLogs = sequelize.define('downloadLogs',{
//     fileUrl:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     date:{
//         type:Sequelize.STRING
//     }
// })
// module.exports = DownloadLogs;