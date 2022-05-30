const { Sequelize } = require('sequelize');
module.exports = new Sequelize('ui_test', 'ui_test', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases:false,
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
});