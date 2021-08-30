const AdminModel = require('../models/admin.model')
const User = require("../models/user.model");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const { validationResult } = require('express-validator');

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
                    adminPrivilege: 'sub-admin',
                })
                Admin.save().then(result => {
                    res.status(200).json({
                        massage: "save user successful ",
                        admin: result
                    })

                }).catch(err => {
                    res.status(404).json({
                        massage: "can not save user | catch err",
                        massageErr: err
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