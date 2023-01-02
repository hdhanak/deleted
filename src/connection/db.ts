import { connect } from "mongoose";
require('dotenv').config()

function connects(){
    return connect("mongodb://localhost:27017/try")
    .then(()=>{
        console.log('connected successfully');
        
    }).catch((e)=>console.log(e)
    )
} 

export default connects