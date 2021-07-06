const router = require('express').Router();
const path = require('path')
const { registerWorkerValidation } = require('../services/Validation.user.service')
const workerController = require('../controllers/worker.controller')
const userController = require('../controllers/user.controller')
const multer = require('multer')
const check = require('express-validator').check
// upload Image Config 
let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callFun) => {
            callFun(null, 'images')
        },
        filename: (req, file, callFun) => {
            callFun(null, Date.now().toString() + '-' + file.originalname)
        }
    })
})




// full api api/worker/login
// router.post('/login',loginWorkerValidation,workerController.login)
// scenario login : not need validation input value  for attack can not detection valid format 
router.post('/login', workerController.login)
// register worker 
// full path : /api/worker/register
router.post('/register', upload.single("workerImage"),  registerWorkerValidation,
    workerController.register)

// تابع الحذف نفسه وبما انه المهني والعامل نفس الكولكشن قمنا بتنفيذ نفس تابع الحذف 
router.delete('/delete/:id',userController.deleteUser)
// something update worker {update by id } : update password my use case 
// we need validation input update data
router.patch('/update/:id',

check('password').notEmpty().withMessage("password is required").isStrongPassword().withMessage("password not strong "),
workerController.update)



module.exports = router;