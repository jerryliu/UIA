const Sequelize = require('sequelize'); 
const db = require('../config/database');

const Users = db.define('users', {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      primaryKey: true,
      allowNull: false,
      autoIncrement:true
    },
    acct: {
      type: Sequelize.STRING,
      field: 'acct',
      allowNull: false,
      unique: true  
    },
    pwd: {
      type: Sequelize.STRING,
      field: 'pwd'
    },
    fullname: {
      type: Sequelize.STRING,
      field: 'fullname'
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at'
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: true,
    underscored: true
  });

module.exports = Users;
