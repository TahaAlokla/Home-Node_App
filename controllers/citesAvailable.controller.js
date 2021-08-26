const { validationResult } = require('express-validator');
const citesAvailableModel = require('../models/cites.model')

//*  get all citesAvailable
exports.getAllCitesAvailable=(req, res, next)=>{
    citesAvailableModel.find({}).select('_id  cityName').then(citesArray=>{
        console.log(" cites array :",citesArray);
        if(citesArray.length>0){
            res.status(200).json({
                citesArray:citesArray,
                massage:"قائمة المدن المتاحة  "
            })

    }else{
        res.status(200).json({
            citesArray:citesArray,
            massage:"There is no cites yet !"
        }) 
    }
}).catch(err=>{
    res.status(404).json({
        massageErr: err,
        massageFrom: " get All cites  From DB | catch Err "
    })
})
}

// * Add CityAvailable 
exports.addCityAvailable =(req, res, next)=>{

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // bad Request !
        return res.status(400).json({
            errorsValidation: errors.array()[0].msg
        });
    }

    const CityAvailable = new citesAvailableModel({
        cityName:req.body.cityName,
       
    })
    CityAvailable.save().then(result => {
        res.status(200).json({
            massage: 'successfully save new   CityAvailable ',
            QuestionAndAnswer: result
        })
    }).catch(err => {
        res.status(404).json({
            massage: "can not save Service ! ",
            massageFrom: "save   CityAvailable add ",
            massageErr: err
        })
    })
     
}