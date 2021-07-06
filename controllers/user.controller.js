const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { registerUserValidation } = require('../services/Validation.user.service')
const { loginUserValidation } = require('../services/Validation.user.service')
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const { validationResult } = require('express-validator');
// ################### user Type "client "########################### 

exports.register = (req, res, next) => {
    // validation user input value 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // bad Request !
        return res.status(400).json({
            errorsValidation: errors.array()[0].msg
        });
    }

    // checking if user already exists
    User.findOne({ phoneNumber: req.body.phoneNumber }).then(result => {
        if (result) {
            res.status(404).json({
                massage: "phone Number Exists | user already Exist"
            })
        } else {
            // hash password 
            bcrypt.hash(req.body.password, salt).then(hashPassword => {
                // create new user of database 
                const user = new User({
                    username: req.body.username,
                    phoneNumber: req.body.phoneNumber,
                    password: hashPassword,
                    city: req.body.city,
                    typeUser:"client"
                })
                user.save().then(result => {
                    res.status(200).json({
                        massage: "save user successful ",
                        user: user
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

exports.login = (req, res, next) => {
    // validation user input value 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // bad Request !
        return res.status(400).json({
            errorsValidation: errors.array()[0].msg
        });
    }
    // ****************************************************
    //  checking if user Not  exists
    User.findOne({ phoneNumber: req.body.phoneNumber }).then(user => {
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
                        typeUser: user.typeUser
                    }, process.env.TOKEN_SECRET, {
                        expiresIn: "15d"
                    })
                    res.header('Authorization', token).json({
                        massage: 'success login ',
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

exports.deleteUser=(req, res, next)=>{
     console.log("tets ",req.params.id);
     User.findOneAndDelete({_id:req.params.id}).then((result)=>{
        // this findOneAndDelete return document before delete 
       console.log("test delete user",result);
        if(result){
            console.log(result);
            res.status(202).json({
                massage:'تم حذف هذا الحساب بنجاح | redirect home page or register page '
            })
        }else{
            // if user already deleted  
            // console.log(result); : allows print null 
            res.status(404).json({
                massage:"هذا الحساب محذوف مسبقاً",   
            })
        }
        

    }).catch(err=>{
        res.status(404).json({
            massage:'هذا الحساب غير موجود بالفعل ,',
            massageFrom:'id object not find '+err
        })
    })
}

exports.updateUser=(req, res, next)=>{
    console.log(req.params.id)
      bcrypt.hash(req.body.password,salt).
      then(hash=>{
        // hear data to need update |my use case [ update password ]
          const newUser ={
            password:hash
          }
     
          User.findOneAndUpdate({_id:req.params.id},{$set:newUser},{new:true})
        .then(user=>{
            if(!user){
                res.status(404).json({
                    massage:"هناك خطاء في الايدي غير صحيح"
                })
            }
           
            console.log("user after update",user)
            res.status(202).json({
                massage:'user update successfully ',
                user:user
            })

        }).catch(err=>{
            res.status(404).json({
                massage:err,
                massageFrom:"can not update user err catch | can not find user by id "+req.params.id
            })

        })
      }).
      catch(err=>{
          res.status(404).json({
              massage:err,
              massageFrom:"bcrypt.hash error catch"
          })

      })
}
