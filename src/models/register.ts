import mongoose, { model, Schema } from "mongoose";
var mongooseTypePhone = require('mongoose-type-phone');



const registerSchema = new Schema({
   
    firstName:{
        type:String,
        required: true
    },
    
    email:{
        type:String,
    },
    password:{
        type:String
    },
    PhoneNo: {
        type: Schema.Types.Mixed,
        // required: 'Phone number should be set correctly',
        // allowBlank: false,
        // allowedNumberTypes: [mongooseTypePhone.PhoneNumberType.MOBILE, mongooseTypePhone.PhoneNumberType.FIXED_LINE_OR_MOBILE],
        // phoneNumberFormat: mongooseTypePhone.PhoneNumberFormat.INTERNATIONAL, // can be omitted to keep raw input
        // defaultRegion: 'RU',
        // parseOnGet: false
    }



    
},{versionKey:false})
registerSchema.index({location:"2dsphere"})

const signUp = model('register',registerSchema,'register')
export {registerSchema}
export default signUp