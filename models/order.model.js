const { object, date } = require('joi');
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema,
ObjectId= Schema.ObjectId;
const orderSchema=  mongoose.Schema({
    IdClient:{
        type:ObjectId,
        ref:"user",
        required :true,
    },
    IdWorker :{
        type:ObjectId,
        ref:"user",
        required :true,
    },
    serviceName:{
        type:"String",
        // ref:"Service",
        required :true,
    },
    timeOrder:{
        type:Date,
        default:Date.now
        // required :true,
    },
    OrderStatus:{
        type:String,
        enum: ['معلق', 'مقبول','مرفوض','ألغاء','منهي'],
        default:'معلق'
    }
},{ timestamps: true })
orderSchema.index({IdClient: 1, IdWorker: 1}, {unique: true});
module.exports = mongoose.model("Order",orderSchema)
