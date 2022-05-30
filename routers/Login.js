const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync(path.resolve('./token/jwtRS256.key'));
const jwt = require('jsonwebtoken');
const { MD5 } = require('crypto-js');
const Users =require('../models/Users');
router.use(bodyParser.urlencoded({ extended: false }));
router.use( bodyParser.json());

//8:Create an API to generate the token to the user (user sign in).
router.post('/', async (req, res) => {
  const formData = req.body;
  let resultObj={status:0,info:"", data:{}};
  if(!formData["acct"] || !formData["pwd"]){
    resultObj["info"]="Please input full data";
    return res.json(resultObj)
  }else{
    formData["acct"]=formData["acct"].trim();
    formData["pwd"]=formData["pwd"].trim();
  }
  formData["pwd"] = MD5(formData["pwd"]).toString();

  // Query by acct and pwd
  try{
    resultObj["data"] = await Users.findOne({
      where: {
        acct: formData["acct"],
        pwd: formData["pwd"],
      }
    });
    const token = jwt.sign({ 
      acct: formData["acct"], 
      pwd: formData["pwd"], 
      fullname:['fullname']}, 
      privateKey, { algorithm: 'RS256'}
    );
    if(resultObj["data"]  === null){
      resultObj["status"] = 0;
      resultObj["info"] ="User not found";
      resultObj["data"]  = {};
    }else{
      resultObj["status"] =1;
      resultObj["info"] ="OK";
      resultObj["token"] = token;
    }
    res.json(resultObj);
  }catch(err){
    resultObj["info"]=err.errors[0].message;
    res.send(resultObj);
  }

})
module.exports = router;