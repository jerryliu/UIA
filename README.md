# UIAssignment
## Environment Setup
Create the git repository and create a new branch: develop. 
You should also initialize the npm project with eslint.
```
git clone git@github.com:jerryliu/UIA.git
git checkout -B develop
npm install eslint
```

#### (develop)commit 1: Generate the development key pair for encrypting/validating JWT.
```
mkdir token
# Don't add passphrase
ssh-keygen -t rsa -b 4096 -m PEM -f ./token/jwtRS256.key
```
#### (develop)commit 2: Create a new script in package.json.
Use docker to run a PostgreSQL instance.
■ Database name: ui_test
■ Database user: ui_test
```
docker pull postgres
npm run init-database
```
#### (develop)commit 3: Create a new script to populate an users table in package.json.
```
npm run migrate-database
```
## Basic
### Requirements
* Create a feature branch: feat/impl-api.
```
git checkout -b feat/impl-api
git push --set-upstream origin feat/impl-api
```
* Use express to build a RESTful service.
Postman URL as follows https://www.getpostman.com/collections/c578f71fd88881111ed1
* Use sequelize to access the users table.
I made a modes/users.js for aceess the user table 
* Use JWT as access token for each API, except sign in and sign up.
I made a helps/verifyToken.js for common using
#### (feat/impl-api)commit 4: Create an API to list all users.
* I made a index.js, database.js, routers/Users.js and migrations 
* Please sign up and login for the get user token
#### (feat/impl-api)commit 5: Create an API to search an user by fullname.
* I made an object for the where condition.