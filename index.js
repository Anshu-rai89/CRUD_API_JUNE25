const app = require('./app');
const port = 7000;
const db = require('./config/mongoose');


app.listen(port, ()=> {console.log(`Server is Up & running at ${port}`)} );