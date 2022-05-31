const express = require('express');
// Database connect
const db = require('./config/database')
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
// Test Database
db.authenticate().then(()=>console.log("DB connect")).catch(err => console.log(err))

// swagger options 
const options = {
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            title: "User API",
            version: "1.0.0",
            descrption: "UI Assignment User API"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
    },
    apis: [`${__dirname}/routers/*.js`]
}
console.log(`${__dirname}/routers/*.js`);
const app = express();
const specs = swaggerJsDoc(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.get('/', (req, res)=> res.send("Index"));

// Users routers
app.use('/users', require('./routers/Users'));
app.use('/login', require('./routers/Login'));
const PORT= process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`))