const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DownloadLogs = sequelize.define('downloadLogs',{
    fileUrl:{
        type:Sequelize.STRING,
        allowNull:false
    },
    date:{
        type:Sequelize.STRING
    }
})
module.exports = DownloadLogs;