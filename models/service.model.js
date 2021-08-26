const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const servesSchema= mongoose.Schema({
    serviceName:{
        type:String,
        required: true ,
        unique: true
     
    },
    serviceImage:{
        type:String,
        required: true ,
        unique: true
    },
    serviceDescription:{
        type:String,
        required: true ,
        unique: true
    },
    tags:{
        type:[String],
        default: []
    }
},{ timestamps: true })
servesSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
module.exports = mongoose.model("Service",servesSchema)