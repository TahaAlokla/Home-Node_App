const router = require('express').Router();
const userController = require('../controllers/user.controller')
const { registerUserValidation } = require('../services/Validation.user.service')
const { loginUserValidation } = require('../services/Validation.user.service')
const authUser = require('../guards/auth.user.guard')
// full api:  /api/user/register
router.post('/register', registerUserValidation, userController.register)
// full api:  /api/user/login
router.post('/login', loginUserValidation, userController.login)
// delete user /api/user/deleteUser/:id [id: req.parmas.id]
// authUser.isAuthUser : check if token valid && user type= client 
router.delete('/delete/:id',authUser.isAuthUser,userController.deleteUser)
// update User /api/user/update/:id
router.patch('/update/:id',authUser.isAuthUser ,userController.updateUser)
//  search workerProviderService 
router.post('/searchWorker', authUser.isAuthUser,userController.searchWorker)
// * user request order 
router.post('/addOrder', authUser.isAuthUser,userController.addOrderWorker)

// get order status pending 
// getOrderStatusPending

 router.post('/getOrderStatusPending', authUser.isAuthUser, userController.getOrderStatusPending)

 router.post('/GetAllOrderStatus',authUser.isAuthUser, userController.GetAllOrderStatus)
module.exports = router;