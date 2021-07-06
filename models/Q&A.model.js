const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const QuestionAndAnswerSchema = mongoose.Schema({
    Question: {
        type: String,
        min: 6,
        max: 1500,
        unique: true,
    },
    Answer: {
        type: String,
        min: 6,
        max: 1500,
        unique: true,
    }
}, { timestamps: true })
QuestionAndAnswerSchema.plugin(uniqueValidator);
module.exports = mongoose.model('QuestionsAndAnswer', QuestionAndAnswerSchema);