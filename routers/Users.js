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
//11: Create a query parameter for paging and sorting.
router.get('/', verifyToken, async (req, res) => {
  let resultObj={status:0,info:"", data:[]};
  if(!req.authenticated){
    resultObj["info"]="Unauthicated access";
    return res.json(resultObj)
  } 
  let where={};
  let order=[];
  let limit=null;
  let offset=0;
  if(req.query['fullname']){
    where['fullname'] = req.query['fullname'].trim();
  }
  // 11-1 check limit value
  if(parseInt(req.query['limit'])  > 0 && Number.isInteger(parseInt(req.query['limit']) )){
    limit=parseInt(req.query['limit'])
  }
  // 11-2 check offset value 
  if( parseInt(req.query['offset']) > 0 && Number.isInteger(parseInt(req.query['offset']) )){
    offset=parseInt(req.query['offset'])
  }
  // 11-3 check order value
  if(req.query['order']){
    // if sorting with wrong string, the server will crash.
    let compareList = ['id', 'acct', 'fullname', 'created_at', 'updated_at'];
    let stringArray=req.query['order'].split(',');
    for(let i=0; i < stringArray.length; i++){
      let orderItem=[];
      let orderString = stringArray[i].substring(1)
      if(stringArray[i].charAt(0)==="-"){
        if(compareList.indexOf(orderString)!==-1){
          orderItem.push(orderString);
          orderItem.push('desc');
          order.push(orderItem);
        } 
      }else{
        if(compareList.indexOf(stringArray[i])!==-1){
          orderItem.push(stringArray[i]);
          orderItem.push('asc');
          order.push(orderItem); 
        }   
      }
    }
  }
  try{
    const result = await Users.findAndCountAll({
      attributes: { exclude: ['pwd'] },
      where: where,
      order:order,
      limit:limit,
      offset:offset
    })
    resultObj["status"]=1;
    resultObj["info"]="OK";
    resultObj["data"]=result["rows"];
    resultObj["count"]=result["count"];
  }catch (err){
    resultObj["info"]=err;
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
    resultObj["info"]=err
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
  }
  for (let [key] of Object.entries(formData)) {
    formData[key] = formData[key].trim();
  }
  formData["pwd"] = MD5(formData["pwd"]).toString();
  try{
    const user = await Users.create(formData)
    resultObj["status"]=1
    resultObj["info"]="Create user successfully";
    resultObj["data"]=user;
    res.send(resultObj)
  } catch(err){
    resultObj["info"]=err;
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
    resultObj["info"]=err;
    res.send(resultObj);
  }
})

//10:Create an API to update the user.
router.put('/:id',verifyToken, async (req, res) => {
  let resultObj={status:0,info:"", data:{}};
  if(!req.authenticated){
    resultObj["info"]="Unauthicated access";
    return res.json(resultObj)
  } 
  if(isNaN(req.params.id)){
    resultObj["info"]="Please input a user ID";
    return res.json(resultObj)
  }
  const formData = req.body;
  if(!formData["acct"] || !formData["pwd"] || !formData["fullname"]){
    resultObj["info"]="Please input full data";
    return res.json(resultObj)
  }
  for (let [key] of Object.entries(formData)) {
    formData[key] = formData[key].trim();
  }
  formData.updated_at = new Date();
  if(formData["pwd"]){
    formData["pwd"] = MD5(formData["pwd"]).toString();
  }
  try{
    const result = await Users.update(formData,{
      where: {id: req.params.id}
    })
    if(result[0]===0){
      resultObj["status"]=0
      resultObj["info"]="User ID not found";
    }else{
      resultObj["status"]=1
      resultObj["info"]="The user was updated";
      resultObj["data"]=formData;
    }
    res.send(resultObj)
  }catch(err){
    resultObj["info"]=err
    res.send(resultObj);
  }

})
module.exports = router;