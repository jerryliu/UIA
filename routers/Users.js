const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const MD5 = require("crypto-js/md5");
const Users =require('../models/users');
const verifyToken = require('../helps/verifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//4:Create an API to list all users.
//5:Create an API to search an user by fullname.
router.get('/', verifyToken, async (req, res) => {
  let resultObj={status:0,info:"", data:[]};
  if(!req.authenticated){
    resultObj["info"]="Unauthicated access";
    return res.json(resultObj)
  } 
  let where={}
  if(req.query['fullname']){
    where['fullname'] = req.query['fullname'].trim();
  }
  try{
    resultObj["data"] = await Users.findAll({
      attributes: { exclude: ['pwd'] },
      where: where
    })
    resultObj["status"]=1;
    resultObj["info"]="OK";
  }catch (err){
    resultObj["info"]=err.name;
    res.send(resultObj)      
  }
  res.json(resultObj);
})

//6:Create an API to get the user’s detailed information.
router.get('/:id',verifyToken ,async (req, res) => {
  // Check if id not number  
  let resultObj={status:0,info:"", data:{}};
  if(!req.authenticated){
    resultObj["info"]="Unauthicated access";
    return res.json(resultObj)
  } 
  if(isNaN(req.params.id)){
    resultObj["info"]="Please Input a user ID";
    return res.json(resultObj)
  }
  try{
    // Query by id
    resultObj["data"] = await Users.findOne({
      where: {id: req.params.id}
    });
    if(resultObj["data"]  === null){
      resultObj["status"] = 0;
      resultObj["info"] ="User not found";
      resultObj["data"]  = {};
    }else{
      resultObj["status"] =1;
      resultObj["info"] ="OK";
    }
    res.json(resultObj);
  }catch(err){
    resultObj["info"]=err.name;
    res.send(resultObj)    
  }

})

module.exports = router;