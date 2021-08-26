const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema,
ObjectId= Schema.ObjectId;
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required : true,
        min:2,
        max:40
    },
    phoneNumber:{
        type:String,
        required:true,
        min:10,
        max:15,
        unique: true,
        index: { unique: true, sparse: true }
    },
    password :{
        type:String,
        required:true,
        max: 40,
        min:6
    },
    city:{
        type:String,
        default:'damascus',
        min:3,
        max:40
    },
    typeUser:{
        type:String,
        default:"client"||"worker"
    },
    workerImage:{
        type:String
    },
    descriptionService:{
        type:String
    },
    service:{
        type:String,
    },
    workerAge:{
        type:String
    },
    workerAddress:{
        type:String
    },
    workerGender:{
        type:String,
        enum: ['ذكر', 'أنثى'],
    },
    // filed special worker array of request orders [include id order]
    orderRequest:{
        type:[ObjectId]
    }
},{ timestamps: true })
userSchema.plugin(uniqueValidator);
module.exports= mongoose.model('user',userSchema); 
