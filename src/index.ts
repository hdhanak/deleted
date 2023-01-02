import express from 'express'
import connects from './connection/db';
import router from "./router/routers";
const port = 8000 ||  process.env.PORT
const app = express()
var cookies = require("cookie-parser");
const cors = require('cors');

app.use(cookies());

const corsOptions = {
       
    Origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    Network: true
                  
}


app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     console.log("log");
    
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('access-control-allow-credentials',"include")
//     next();
// });
app.use(express.json())








connects()
app.use('/',router)

app.listen(port,()=>{
    console.log(`port listining a ${port}`);
    
})

