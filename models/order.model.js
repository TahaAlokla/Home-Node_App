const { object } = require('joi');
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema,
ObjectId= Schema.ObjectId;
const orderSchema=  mongoose.Schema({
    IdClient:{
        type:ObjectId,
        required :true,
    },
    IdWorker :{
        type:ObjectId,
        required :true,
    },
    IdService:{
        type:ObjectId,
        required :true,
    },
    timeOrder:{
        type:Date,
        required :true,
    },
    OrderStatus:{
        type:String,
        enum: ['hanging', 'Acceptance','reject','Cancellation','ending '],
        default:'hanging'
    }
},{ timestamps: true })
module.exports = mongoose.model("Order",orderSchema)
