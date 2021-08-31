const AdminModel = require('../models/admin.model')
const User = require("../models/user.model");
const serviceModel = require('../models/service.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const { validationResult } = require('express-validator');
const orderModel = require('../models/order.model');

// ###############################  Admin Controller #####################

// login Admin
// You Need Phone Number && Password 
exports.login = (req, res, next) => {
    // validation Admin input value 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // bad Request !
        return res.status(400).json({
            errorsValidation: errors.array()[0].msg
        });
    }
    // ****************************************************
    //  checking if Admin Not  exists
    AdminModel.findOne({ phoneNumber: req.body.phoneNumber }).then(user => {
        if (!user) {
            res.status(404).json({
                massage: "Phone number  is wrong "
            })
        } else {
            // password is correct
            // console.log(user);
            bcrypt.compare(req.body.password, user.password).then((result) => {
                if (result) {
                    // Create And assigned Token 
                    // console.log("user id :", user._id);
                    const token = jwt.sign({
                        _id: user._id,
                        adminPrivilege: user.adminPrivilege
                    }, process.env.TOKEN_SECRET, {
                        expiresIn: "30d"
                    })
                    res.header('Authorization', token).json({
                        massage: 'success login ',
                        typeUser:'admin',
                        // * send admin 
                        user:user,
                        token: token
                    })

                } else {
                    res.status(400).json({
                        massage: "password is incorrect"
                    })
                }
            }).catch(err => {
                res.status(404).json({
                    massage: 'error catch compare password ',
                    massageErr: err
                })
            })
        }
    })
}


// add Admin [sub-admin]
exports.addAdmin=(req, res, next)=>{
    console.log("test add admin controller");

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // bad Request !
        return res.status(400).json({
            errorsValidation: errors.array()[0].msg
        });
    }
    // checking if user already exists
    AdminModel.findOne({ phoneNumber: req.body.phoneNumber }).then(result => {
        if (result) {
            res.status(404).json({
                massage: "phone Number Exists | Admin already Exist"
            })
        } else {
            // hash password 
            console.log("test before hashing " ,req.body.password);
            bcrypt.hash(req.body.password, 10).then(hashPassword => {
                console.log("hashing password", hashPassword);
                // create new user of database 
                const Admin = new AdminModel({
                    adminName: req.body.adminName,
                    phoneNumber: req.body.phoneNumber,
                    password: hashPassword,
                    adminPrivilege: req.body.adminPrivilege,
                })
                Admin.save().then(result => {
                    res.status(200).json({
                        massage: "save Admin successful ",
                        admin: result
                    })

                }).catch(err => {
                    res.status(404).json({
                        massage: "can not save user | catch err" +err,
                       
                    })
                })

            }).catch(err => {
                res.status(400).json({
                    massage: "catch error hashing password ",
                    massageErr: err
                })
            })
        }
    })
  
 

}

// deleteAdmin 
exports.deleteAdmin=(req, res, next)=>{
  AdminModel.findOneAndDelete({ _id: req.params.id })
    .then((result) => {
      // this findOneAndDelete return document before delete
      console.log("test delete Admin", result);
      if (result) {
        console.log(result);
        res.status(200).json({
          massage:
            "تم حذف هذا الحساب بنجاح ",
        });
      } else {
        // if user already deleted
        // console.log(result); : allows print null
        res.status(401).json({
          massage: "هذا الحساب محذوف مسبقاً",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        massage: "هذا الحساب غير موجود بالفعل ,"+ err
      
      });
    });

}

// blocked user 
exports.blockedUserActivate=(req, res , next )=>{
    User.findOneAndUpdate(
      { phoneNumber: req.body.phoneNumber },
      { $set:{activeUser:false} },
      { new: true }).then(result=>{
        if(!result){
          res.status(400).json({
            massage:'error phone number can not found ! '+ req.body.phoneNumber,
           
          })
          
        }else{
          res.status(200).json({
            massage:'successfully blocked user ',
            activeUserStatus:result.activeUser
  
          })
        }
  
      }).catch(err=>{
        res.status(400).json({
          massage:'something Error catch err blocked user '
        })
      })
  
  }

//   unblocked user
exports.unBlockedUserActivate=(req, res , next )=>{
    User.findOneAndUpdate(
      { phoneNumber: req.body.phoneNumber },
      { $set:{activeUser:true} },
      { new: true }).then(result=>{
        if(!result){
          res.status(400).json({
            massage:'error phone number can not found ! '+ req.body.phoneNumber,
           
          })
          
        }else{
          res.status(200).json({
            massage:'successfully Unblocked user ',
            activeUserStatus:result.activeUser
  
          })
        }
  
      }).catch(err=>{
        res.status(400).json({
          massage:'something Error catch err blocked user '
        })
      })
  
  }

//   get All user 
exports.getAllUser = ( req, res, next)=>{
    User.find({}).select('id typeUser activeUser  username phoneNumber createdAt service').then(result=>{
      let clientUser = result.filter(user=>user.typeUser==="client")
      let WorkerUser = result.filter(user=>user.typeUser==="worker")
      let blockedUser = result.filter(user=>user.activeUser===false)
  
      res.status(200).json({
        clientUser:clientUser,
        WorkerUser:WorkerUser,
        blockedUser:blockedUser,
        massage:' list of user storage DB'
  
      })
    }).catch(err=>{
      res.status(404).json({
        massage:'something error of get all user catch err '
      })
    })
  }

  exports.viewServices = (req, res, next) => {

    serviceModel.find({}).select(' _id serviceName serviceDescription serviceImage').then(services => {
        console.log(services)
        if (services.length > 0) {
            res.status(200).json({
                services: services,
                massage: "قائمة خدماتنا "
            })
        } else {
            res.status(200).json({
                services: services,
                massage: "لا يوجد اي خدمة بعد "
            })
        }

    }).catch(err => {
        res.status(404).json({
            massageErr: err,
            massageFrom: " get All Services From DB | catch Err "
        })

    })

}

exports.getAllAdmins= (req, res ,next)=>{
  AdminModel.find({}).select('_id  adminName phoneNumber adminPrivilege createdAt ').then(result=>{
    if(!result){
      res.status(400).json({
        massage:' can not found any admins !! '
      })
    }else{
      res.status(200).json({
        admins: result,
        massage:'array of admins '

      })
    }
  }).catch(err=>{
    res.status(400).json({
      massage:'catch error when get all admins error massage'+ err,
      
    })
  })

}

// get All Orders 
// ,{path:"IdClient", select:"username"}
exports.getAllOrders =(req, res , next)=>{
  orderModel.find({}).select('IdClient IdWorker  serviceName timeOrder OrderStatus massageFromUser createdAt').populate({path:"IdWorker", select:"username"}).populate({path:"IdClient", select:"username"})
  .then(result=>{
    if(!result){
      res.status(400).json({
        massage:' something Error can not fetch any data of order model ! '
      })
    }else{
      res.status(200).json({
        orders: result,
        massage:'lists of orders '

      })
    }


  }).catch(err=>{
    res.status(400).json({
      massage:'catch error' + err
    })
  })

}