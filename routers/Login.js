const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync(path.resolve('./token/jwtRS256.key'));
const jwt = require('jsonwebtoken');
const { MD5 } = require('crypto-js');
const Users =require('../models/users');
router.use(bodyParser.urlencoded({ extended: true }));
router.use( bodyParser.json());

//8:Create an API to generate the token to the user (user sign in).
//13: Create a swagger document for your APIs.

/**
 * @swagger
 * components:
 *  schemas:
 *    login:
 *      type: object
 *      required:
 *        - acct
 *        - pwd
 *      properties:
 *        acct:
 *          type: string
 *        pwd:
 *          type: string
 *      example:     
 *        acct: jerry
 *        pwd: jerry
 * 
 */
/**
 * @swagger
 * /login:
 *   post:
 *    summary:  Login the system and get token
 *    tags: [User login]
 *    requestBody:
 *      requested: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              acct:
 *                type: string
 *              pwd:
 *                type: string
 *            example:
 *              acct: jerry
 *              pwd: jerry  
 *    responses:
 *      200:
 *        description: A user dara with token
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example:
 *                status: 1
 *                info: OK
 *                data:
 *                  id: 30
 *                  acct: jerry
 *                  pwd: ee5d...
 *                  fullname: jerry
 *                  created_at: '2022-05-31T09:46:03.775Z'
 *                  updated_at: '2022-05-31T09:46:03.775Z'
 *                  token: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2N0IjoiamVycnkiLCJwd2QiOiIzMDAzNTYwN2VlNWJiMzc4YzcxYWI0MzRhNmQwNTQxMCIsImZ1bGxuYW1lIjpbImZ1bGxuYW1lIl0sImlhdCI6MTY1Mzk5MDc4MX
 */

router.post('/', async (req, res) => {
  const formData = req.body;
  console.log(req.body);
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
    resultObj["info"]=err
    res.send(resultObj);
  }

})
module.exports = router;