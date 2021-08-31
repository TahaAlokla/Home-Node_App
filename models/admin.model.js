const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
const AdminSchema = mongoose.Schema({
    adminName :{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true ,
    },
    phoneNumber:{
        type:String,
        required: true ,
        unique:true,
        index: { unique: true, sparse: true }
    },
    adminPrivilege:{
        type:String,
        enum: ['full-admin', 'sub-admin'],
        default:"full-admin"
    }
},{ timestamps: true })

AdminSchema.plugin(uniqueValidator);
module.exports= mongoose.model('Admin', AdminSchema); 
