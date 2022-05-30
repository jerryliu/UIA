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