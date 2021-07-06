const router = require('express').Router();

const QuestionsAndAnswerController = require('../controllers/QuestionAndAnswer.controller')


router.get('/', QuestionsAndAnswerController.allQuestionAndAnswer)


module.exports= router;