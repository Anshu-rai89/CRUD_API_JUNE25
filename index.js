const express = require('express');
const port = 7000;
const app = express();
const db = require('./config/mongoose');
app.get('/hello', (req,res)=> {
    return res.status(200).json({msg:"Hello world"});
})

app.use(express.json())
// /posts GET

app.use('/', require('./routes'))


app.listen(port, ()=> {console.log(`Server is Up & running at ${port}`)} );