'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  users.init({
    acct: DataTypes.STRING,
    pwd: DataTypes.STRING,
    fullname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};