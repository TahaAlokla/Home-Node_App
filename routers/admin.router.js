const router = require('express').Router();
const adminController = require('../controllers/admin.controller')
const serviceController = require('../controllers/service.controller')
const userController = require('../controllers/user.controller')
const QuestionAndAnswerController = require('../controllers/QuestionAndAnswer.controller')
const citesAvailableController = require('../controllers/citesAvailable.controller')
const authAdmin = require('../guards/auth.admin')
const { loginAdminValidation } = require('../services/Validation.user.service')
const { addAdminValidation } = require('../services/Validation.user.service')
const {QuestionAndAnswerValidation} = require('../services/Validation.user.service')
const {citesAvailableValidation} = require('../services/Validation.user.service')


const multer = require('multer')
let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callFun) => {
            callFun(null, 'images')
        },
        filename: (req, file, callFun) => {
            callFun(null,'image'+ new Date().toISOString().toString().replace(/:/g,'I')+'_' +file.originalname)
        }
    })
})

// not needed authentication 
router.post('/login', loginAdminValidation, adminController.login)

// add Service 
// * should protect router [authorization] Admin only can access 
// [authorization] by Token Id && adminPrivilege
router.post('/service/addservice', authAdmin.isAuthAdmin, upload.single('serviceImage'), serviceController.addService)
// delete service 
router.delete('/deleteService/:id', authAdmin.isAuthAdmin, serviceController.deleteService)
//  update service
router.patch('/updateService/:id', authAdmin.isAuthAdmin,
    upload.single('serviceImage'), serviceController.updateService)


// add admin
router.post('/addAdmin', authAdmin.isAuthAdmin, addAdminValidation, adminController.addAdmin)


// add QuestionAndAnswer
router.post('/addQ&A',authAdmin.isAuthAdmin,QuestionAndAnswerValidation,QuestionAndAnswerController.addQuestionAndAnswer)
// delete QuestionAndAnswer
router.delete('/deleteQ&A/:id',authAdmin.isAuthAdmin,QuestionAndAnswerController.deleteQuestion)

// For Test Add full-admin
// router.post('/fullAdmin',

//     adminController.addAdmin)

// * add citesAvailable
router.post('/addCitesAvailable',authAdmin.isAuthAdmin,citesAvailableController.addCityAvailable)

// * get all user 
router.get('/getAllUser', authAdmin.isAuthAdmin, userController.getAllUser)

module.exports = router;