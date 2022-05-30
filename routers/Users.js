const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const MD5 = require("crypto-js/md5");
const Users =require('../models/users');
const verifyToken = require('../helps/verifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//4:Create an API to list all users.
router.get('/', verifyToken, async (req, res) => {
  let resultObj={status:0,info:"", data:[]};
  if(!req.authenticated){
    resultObj["info"]="Unauthicated access";
    return res.json(resultObj)
  } 
  try{
    resultObj["data"] = await Users.findAll({
      attributes: { exclude: ['pwd'] },
    })
    resultObj["status"]=1;
    resultObj["info"]="OK";
  }catch (err){
    console.log(err)
    resultObj["info"]=err.name;
    res.send(resultObj)      
  }
  res.json(resultObj);
})

module.exports = router;