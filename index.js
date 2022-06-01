const express = require('express');
const app = express();
const helmet = require("helmet");
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
// Database connect
const db = require('./config/database')
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc");
const PORT= process.env.PORT || 3000;
const httpsOptions = {
    key:fs.readFileSync(path.resolve('./certificates/key.pem'), 'utf8'),
    cert:fs.readFileSync(path.resolve('./certificates/cert.pem'), 'utf8')
}
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
const specs = swaggerJsDoc(options)
// Apply the helmet package for security issues
app.use(helmet());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.get('/', (req, res)=> res.send("Index"));

app.get('/socket', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// Make io accessible to other router
app.use((req,res,next)=>{
    req.io = io;
    next();
});
// Users routers
app.use('/users', require('./routers/Users'));
app.use('/login', require('./routers/Login'));
app.use("/public", express.static(path.join(__dirname, 'public')));
const sslServer = https.createServer(httpsOptions, app)
sslServer.listen(3443, ()=> console.log("Secure service on port 3443"))
server.listen(PORT, console.log(`Server started on port ${PORT}`))