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

//7:Create an API to create the user (user sign up).
router.post('/', async (req, res) =>{
  const formData = req.body;
  let resultObj={status:0,info:"", data:{}};
  if(!formData["acct"] || !formData["pwd"] || !formData["fullname"]){
    resultObj["info"]="Please input full data";
    return res.json(resultObj)
  }else{
    formData["acct"]=formData["acct"].trim();
    formData["pwd"]=formData["pwd"].trim();
    formData["fullname"]=formData["fullname"].trim();
  }
  formData["pwd"] = MD5(formData["pwd"]).toString();
  try{
    const user = await Users.create(formData)
    resultObj["status"]=1
    resultObj["info"]="Create user successfully";
    resultObj["data"]=user;
    res.send(resultObj)
  } catch(err){
    resultObj["info"]=err.name;
    res.send(resultObj)
  }
})
//9:Create an API to delete the user.
router.delete('/:id',verifyToken, async (req, res) => {
  let resultObj={status:0,info:"", data:{}};
  if(!req.authenticated){
    resultObj["info"]="Unauthicated access";
    return res.json(resultObj)
  }
  // Check if id not number  
  if(isNaN(req.params.id)){
    resultObj["info"]="Please input a user ID";
    return res.json(resultObj)
  }
  try{
    resultObj['status'] = await Users.destroy({
        where: {id: req.params.id}
    });
    resultObj['info'] = (resultObj['status']  === 1)? `The user ID:${req.params.id} was deleted`:`The user ID does not exist`;
    res.json(resultObj);
  }catch(err){
    resultObj["info"]=err.name;
    res.send(resultObj)
  }
})
module.exports = router;