// Format of Token 
// Authorization: bearer <access_token>
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync(path.resolve('./token/jwtRS256.key'));
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
  if(typeof req.headers['authorization'] !== 'undefined' ){
      const bearerToken = req.headers['authorization'].split(' ')[1];
      jwt.verify(bearerToken, privateKey, { algorithms: ['RS256'] }, (err, decoded)=>{
        if(err){
          req.authenticated=false;
          req.decoded = null;
          next();
        }else{
          req.authenticated=true;
          req.decoded = decoded;
          next();
        }
      })
    }else{
      res.sendStatus(403)
    }
}