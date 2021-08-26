
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const citesAvailable = mongoose.Schema({
    cityName:{
        type: String,
        unique: true,
        min:3,
        max:30
    }

})

citesAvailable.plugin(uniqueValidator);
module.exports = mongoose.model('citesAvailable', citesAvailable);
