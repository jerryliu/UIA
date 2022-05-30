const express = require('express');
// Database connect
const db = require('./config/database')
// Test Database
db.authenticate().then(()=>console.log("DB connect")).catch(err => console(err))
const app = express();
app.get('/', (req, res)=> res.send("Index"));

// Users routers
app.use('/users', require('./routers/Users'));
app.use('/login', require('./routers/Login'));
const PORT= process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`))