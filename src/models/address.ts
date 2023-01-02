import mongoose, { model, Schema } from "mongoose";
var mongooseTypePhone = require('mongoose-type-phone');



const schema = new Schema({
    userId:mongoose.Types.ObjectId,
    area:{
        type:String,
        required: true
    },    
    city:{
        type:String,
    },
    state:{
        type:String
    },
    country: {
        type: Schema.Types.Mixed,        
    },
    primary:Boolean



    
},{versionKey:false})
schema.index({location:"2dsphere"})

const addressModel = model('address',schema,'address')
// export {schema}
export default addressModel