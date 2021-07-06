const check = require('express-validator').check;
const { body } = require('express-validator');


// * validation input User Register 
const registerUserValidation = [
    body('username').
        notEmpty()
        .withMessage("user name is required ").
        isString()
        .withMessage('username should be string ')
        .isLength({ min: 2, max: 40 })
        .withMessage("username short length or longer length"),
    body('phoneNumber').
        notEmpty()
        .withMessage('phone number is required ')
        .isLength({ max: 15, min: 10 })
        .withMessage("phone number between 10 to 15 number ")
        .isMobilePhone('ar-SY')
        .withMessage("syrian only phone number "),
    body('password')
        .notEmpty()
        .withMessage("password is required ")
        .isString()
        .withMessage("password should be string")
        .isLength({ min: 6, max: 40 })
        .withMessage("password should be between 6 to 40 char "),
    body('city')
        .notEmpty()
        .withMessage('city is required ')
        .isString()
        .withMessage("city should be string ")
]

// login input user validation password && Phone number only 
const loginUserValidation = [
    check('phoneNumber').
        notEmpty()
        .withMessage('phone number is required ')
        .isLength({ max: 15, min: 10 })
        .withMessage("phone number between 10 to 15 number ")
        .isMobilePhone('ar-SY')
        .withMessage("syrian only phone number "),
    check('password')
        .notEmpty()
        .withMessage("password is required ")
        .isString()
        .withMessage("password should be string")
        .isLength({ min: 6, max: 40 })
        .withMessage("password should be between 6 to 40 char "),
]

// worker register validation 
const registerWorkerValidation = [
    // body('username').
    //     notEmpty()
    //     .withMessage("user name is required ").
    //     isString()
    //     .withMessage('username should be string ')
    //     .isLength({ min: 2, max: 40 })
    //     .withMessage("username short length or longer length"),
    body('phoneNumber').
        notEmpty()
        .withMessage('phone number is required ')
        .isLength({ max: 15, min: 10 })
        .withMessage("phone number between 10 to 15 number ")
        .isMobilePhone('ar-SY')
        .withMessage("syrian only phone number "),
    body('password')
        .notEmpty()
        .withMessage("password is required ")
        .isString()
        .withMessage("password should be string")
        .isLength({ min: 6, max: 40 })
        .withMessage("password should be between 6 to 40 char "),
    body('city')
        .notEmpty()
        .withMessage('city is required ')
        .isString()
        .withMessage("city should be string "),
    body('descriptionService')
        .notEmpty()
        .withMessage("description service is required ")
        .isString()
        .withMessage("description service should be string ")
        .isLength({ min: 20, max: 2000 }).
        withMessage("description service between 50 to 2000 char")
        .isAlpha('ar', { ignore: ' ' }).
        withMessage("description service should be  arabic only "),
    body('service')
        .notEmpty().
        withMessage("service option is required ")
        .isString()
        .withMessage(" service is string should be ")
        .isLength({ min: 2, max: 300 })
        .withMessage(" service should be length between 2 to 300 char ")
        .isAlpha('ar', { ignore: ' ' }).
        withMessage("service should be  arabic only "),
    body('workerAge')
        .notEmpty()
        .withMessage(" is birthday  required "),
    // .isDate()
    // .withMessage("birthday should be data"),
    // check if date < 18 return mag: should be grand then 18 year
    body('workerAddress')
        .notEmpty()
        .withMessage("address worker is required ")
        .isAlpha('ar-AE', { ignore: ' ' }).
        withMessage("address should be  arabic only ")
        .isLength({ min: 5, max: 300 })
        .withMessage(" address should be length between 2 to 300 char "),
    body('workerGender')
        .notEmpty()
        .withMessage("workerGender worker is required "),
    check('workerImage').custom((valueInput, { req }) => {
        if (req.file) {
            return true
        } else {
            throw 'Error  image is required '
        }
    })
    // .isIn({['male', 'female']})
    // .withMessage(" male || female only valid value "),
    // how check image file 
]
// worker login validation 
const loginWorkerValidation = [
    check('phoneNumber').
        notEmpty()
        .withMessage('phone number is required ')
        .isLength({ max: 15, min: 10 })
        .withMessage("phone number between 10 to 15 number ")
        .isMobilePhone('ar-SY')
        .withMessage("syrian only phone number "),
    check('password')
        .notEmpty()
        .withMessage("password is required ")
        .isString()
        .withMessage("password should be string")
        .isLength({ min: 6, max: 40 })
        .withMessage("password should be between 6 to 40 char "),

]

const loginAdminValidation = [
    check('phoneNumber').
        notEmpty()
        .withMessage('phone number is required ')
        .isLength({ max: 15, min: 10 })
        .withMessage("phone number between 10 to 15 number ")
        .isMobilePhone('ar-SY')
        .withMessage("syrian only phone number "),
    check('password')
        .notEmpty()
        .withMessage("password is required ")
        .isString()
        .withMessage("password should be string")
        .isLength({ min: 6, max: 40 })
        .withMessage("password should be between 6 to 40 char "),
        

];


const addAdminValidation=[
    check('adminName')
    .notEmpty().withMessage("username is required")
    .isString().withMessage("username should be string ")
    .isLength({min:2,max:20}).withMessage("username should be length 2 to 20 char "),
    check('password')
        .notEmpty()
        .withMessage("password is required ")
        .isString()
        .withMessage("password should be string")
        .isLength({ min: 6, max: 40 })
        .withMessage("password should be between 6 to 40 char "),
        check('phoneNumber').
        notEmpty()
        .withMessage('phone number is required ')
        .isLength({ max: 15, min: 10 })
        .withMessage("phone number between 10 to 15 number ")
        .isMobilePhone('ar-SY')
        .withMessage("syrian only phone number "),


]

const serviceValidation = [
    check('serviceName')
        .notEmpty().withMessage("serviceName is Required ")
        .isLength({ min: 3, max: 100 }).withMessage("serviceName should be length 3 to 100 char")
        .isAlpha('ar', { ignore: ' ' }).
        withMessage("service should be  arabic only "),
        check('serviceDescription')
        .notEmpty().withMessage("serviceDescription is required ")
        .isLength({min:10,max:1000}).withMessage("serviceDescription should be between 10 to 1000 char")
        .isAlpha('ar', { ignore: ' ' }).
        withMessage("service should be  arabic only "),
        check('serviceImage').custom((valueInput, { req }) => {
            if (req.file) {
                return true
            } else {
                throw 'Error  image is required '
            }
        })

];

module.exports.serviceValidation = serviceValidation
module.exports.loginAdminValidation = loginAdminValidation
module.exports.registerUserValidation = registerUserValidation
module.exports.loginUserValidation = loginUserValidation
module.exports.loginWorkerValidation = loginWorkerValidation
module.exports.registerWorkerValidation = registerWorkerValidation
module.exports.addAdminValidation=addAdminValidation