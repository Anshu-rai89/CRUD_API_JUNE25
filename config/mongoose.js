require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const connection = mongoose.connection;
connection.once('open',(data)=> console.log("DB connected"));
connection.on('error', (error)=> console.error('DB error',error));

module.exports = connection;