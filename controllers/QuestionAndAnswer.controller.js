const { validationResult } = require('express-validator');
const QuestionAndAnswerModel = require('../models/Q&A.model')

exports.allQuestionAndAnswer=(req, res ,next)=>{
    QuestionAndAnswerModel.find({}).select('_id  Question  Answer').then(questionsArray=>{

        console.log(" questions array :",questionsArray);
        if(questionsArray.length>0){
            res.status(200).json({
                questionsArray:questionsArray,
                massage:" questionsArray"
            })
        }else{
            res.status(200).json({
                questionsArray:questionsArray,
                massage:"There is no questions yet !"
            })
        }
    }).catch(err=>{
        res.status(404).json({
            massageErr: err,
            massageFrom: " get All Question  From DB | catch Err "
        })
    })
}


exports.addQuestionAndAnswer=(req, res, next)=>{

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // bad Request !
        return res.status(400).json({
            errorsValidation: errors.array()[0].msg
        });
    }

    const QuestionAndAnswer = new QuestionAndAnswerModel({
        Question:req.body.Question,
        Answer:req.body.Answer
    })
    QuestionAndAnswer.save().then(result => {
        res.status(200).json({
            massage: 'successfully save new   QuestionAndAnswer ',
            QuestionAndAnswer: result
        })
    }).catch(err => {
        res.status(404).json({
            massage: "can not save Service ! ",
            massageFrom: "save   QuestionAndAnswer add Q and A Function ",
            massageErr: err
        })
    })
     



}

exports.deleteQuestion = (req, res, next)=>{

    let idQuestion = req.params.id
    // console.log(idService)
    QuestionAndAnswerModel.findByIdAndDelete(idQuestion).then(result => {
        if (result) {
            console.log(result);
            res.status(202).json({
                massage: 'success delete question '
            })
        } else {
            // if user already deleted  
            console.log(result);
            res.status(404).json({
                massage: 'this Question Already Delete ',
                massageCode:"404"

            })
        }
    }).catch(err => {
        res.status(404).json({
            massageFrom: " delete Question  catch error ",
            massage: err
        })

    })
}