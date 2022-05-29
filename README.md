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
# Don't add passphrase
ssh-keygen -t rsa -b 4096 -m PEM -f ./token/jwtRS256.key
```