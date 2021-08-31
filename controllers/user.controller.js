const User = require("../models/user.model");
const Order = require("../models/order.model");
const jwt = require("jsonwebtoken");
const {
  registerUserValidation,
} = require("../services/Validation.user.service");
const { loginUserValidation } = require("../services/Validation.user.service");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const { validationResult } = require("express-validator");
// ################### user Type "client "###########################

exports.register = (req, res, next) => {
  // validation user input value
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // bad Request !
    return res.status(400).json({
      errorsValidation: errors.array()[0].msg,
    });
  }

  // checking if user already exists
  User.findOne({ phoneNumber: req.body.phoneNumber }).then((result) => {
    if (result) {
      res.status(404).json({
        massage: "phone Number Exists | user already Exist",
      });
    } else {
      // hash password
      bcrypt
        .hash(req.body.password, salt)
        .then((hashPassword) => {
          // create new user of database
          const user = new User({
            username: req.body.username,
            phoneNumber: req.body.phoneNumber,
            password: hashPassword,
            city: req.body.city,
            typeUser: "client",
          });
          user
            .save()
            .then((result) => {
              res.status(200).json({
                massage: "save user successful ",
                user: user,
              });
            })
            .catch((err) => {
              res.status(404).json({
                massage: "can not save user | catch err",
                massageErr: err,
              });
            });
        })
        .catch((err) => {
          res.status(400).json({
            massage: "catch error hashing password ",
            massageErr: err,
          });
        });
    }
  });
};

exports.login = (req, res, next) => {
  // validation user input value
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // bad Request !
    return res.status(400).json({
      errorsValidation: errors.array()[0].msg,
    });
  }
  // ****************************************************
  //  checking if user Not  exists
  User.findOne({ phoneNumber: req.body.phoneNumber }).then((user) => {
    if (!user) {
      res.status(404).json({
        massage: "هذا الحساب ليس مسجل",
      });
    } else {
      // password is correct
      // console.log(user);
      bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (result) {
            // Create And assigned Token
            // console.log("user id :", user._id);
            if (user.typeUser === "client") {
              const token = jwt.sign(
                {
                  _id: user._id,
                  typeUser: user.typeUser,
                },
                process.env.TOKEN_SECRET,
                {
                  expiresIn: "15d",
                }
              );
              res.header("Authorization", token).json({
                massage: "success login user",
                token: token,
                userData: {
                  username: user.username,
                  city: user.city,
                  phoneNumber: user.phoneNumber,
                  typeUser: user.typeUser,
                  createdAt: user.createdAt,
                  orderRequest: user.orderRequest,
                  _id: user._id,
                },
              });
            } else {
              // ! for login worker
              //   ! أخترنا هذه الطريقة من أجل الا نعمل 2 تابع تسجيل دخول إلى الباك
              // ! هنا يتم ارسال كامل البيانات المهني في حال كان النوع عامل مهني

              const token = jwt.sign(
                {
                  _id: user._id,
                  typeUser: user.typeUser,
                },
                process.env.TOKEN_SECRET,
                {
                  expiresIn: "15d",
                }
              );
              res.header("Authorization", token).json({
                massage: "success login worker",
                token: token,
                workerProfile: user,
                userData: {
                  username: user.username,
                  city: user.city,
                  phoneNumber: user.phoneNumber,
                  typeUser: user.typeUser,
                  createdAt: user.createdAt,
                  orderRequest: user.orderRequest,
                  _id: user._id,
                },
              });
            }
          } else {
            res.status(400).json({
              massage: "الرقم السري خاطئ ",
            });
          }
        })
        .catch((err) => {
          res.status(404).json({
            massage: "error catch compare password ",
            massageErr: err,
          });
        });
    }
  });
};

exports.deleteUser = (req, res, next) => {
  console.log("tets ", req.params.id);
  User.findOneAndDelete({ _id: req.params.id })
    .then((result) => {
      // this findOneAndDelete return document before delete
      console.log("test delete user", result);
      if (result) {
        console.log(result);
        res.status(202).json({
          massage:
            "تم حذف هذا الحساب بنجاح | redirect home page or register page ",
        });
      } else {
        // if user already deleted
        // console.log(result); : allows print null
        res.status(404).json({
          massage: "هذا الحساب محذوف مسبقاً",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        massage: "هذا الحساب غير موجود بالفعل ,",
        massageFrom: "id object not find " + err,
      });
    });
};

exports.updateUser = (req, res, next) => {
  console.log(req.params.id);
  bcrypt
    .hash(req.body.password, salt)
    .then((hash) => {
      // hear data to need update |my use case [ update password ]
      const newUser = {
        password: hash,
      };

      User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: newUser },
        { new: true }
      )
        .then((user) => {
          if (!user) {
            res.status(404).json({
              massage: "هناك خطاء في الايدي غير صحيح",
            });
          }

          console.log("user after update", user);
          res.status(202).json({
            massage: "user update successfully ",
            user: user,
          });
        })
        .catch((err) => {
          res.status(404).json({
            massage: err,
            massageFrom:
              "can not update user err catch | can not find user by id " +
              req.params.id,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        massage: err,
        massageFrom: "bcrypt.hash error catch",
      });
    });
};

// * user search worker
exports.searchWorker = (req, res, next) => {
  // console.log(req.body)
  User.find({ city: req.body.city, service: req.body.serviceProvider })
    .select(
      " _id username phoneNumber workerImage descriptionService city workerAddress workerGender workerAge"
    )
    .then((result) => {
      console.log(result);
      if (result.length < 1) {
        res.status(200).json({
          length: result.length,
          massage:
            "لا توجد أي نتائج في المدينة " +
            req.body.city +
            " أو الخدمة التي تبحث عنها " +
            req.body.serviceProvider,
        });
      } else {
        res.status(200).json({
          massage:
            " قائمة مقدمي الخدمات في مدينة " +
            req.body.city +
            " والخدمة  " +
            req.body.serviceProvider,
          length: result.length,
          workers: result,
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        massage: err,
        massageFrom: "هناك خطاء في البحث عن الخدمة | catch error ",
      });
    });
};

// * add user order Worker
exports.addOrderWorker = (req, res, next) => {
  // create new Order of database
  const order = new Order({
    IdClient: req.body.IdClient,
    IdWorker: req.body.IdWorker,
    serviceName: req.body.serviceName,
    massageFromUser:req.body.massageFromUser,
    timeOrder: new Date(),
    OrderStatus: "معلق",
  });
  order
    .save()
    .then((doc) => {
      // console.log("add order", doc);
      IO.emit("message"+doc.IdWorker, { type: "notification", objectOrder: doc });
      res.status(200).json({
        massage: "successfully save new Order request  ",
        OrderData: doc,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        massage: "can not save Order ! " + err,
        // massageFrom: "save service addServices Function ",
        // massageErr: err
      });
    });
};

//  getOrderStatusPending [ filter ordersStatus , clientId ]

exports.getOrderStatusPending = (req, res, next) => {
  Order
    .find({ IdClient: req.body.IdClient, OrderStatus: "معلق" })
    .select("IdWorker massageFromUser")
    .then((result) => {
      res.status(200).json({
        IdWorkers: result,
        massage: "this id workers for this filter ",
      });
    })
    .catch((err) => {
      res.status(404).json({
        massage: "can not find result  worker id by filter  ! " + err,
      });
    });
};


exports.GetAllOrderStatus=(req, res,next)=>{
  // .populate({path:"IdWorker", select:"username"})
  Order
    .find({ IdClient: req.body.IdForClient })
    .select("IdWorker serviceName timeOrder OrderStatus").populate({path:"IdWorker", select:"username"})
    .then((result) => {

      let pendingStatus= result.filter(PendStatus =>PendStatus.OrderStatus==="معلق")

      let AcceptStatus= result.filter(PendStatus =>PendStatus.OrderStatus==="مقبول")

      let  RejectionStatus= result.filter(PendStatus =>PendStatus.OrderStatus==="مرفوض")

      // منهي
      let  FinishStatus= result.filter(PendStatus =>PendStatus.OrderStatus==="منهي")

      // ألغاء
      let  CancellationStatus= result.filter(PendStatus =>PendStatus.OrderStatus==="منهي")
      
      res.status(200).json({
        CancellationStatus: CancellationStatus,
        FinishStatus:FinishStatus,
        RejectionStatus:RejectionStatus,
        pendingStatus:pendingStatus,
        AcceptStatus:AcceptStatus,
        massage: "this Order Result for Client Id ",
      });
    })
    .catch((err) => {
      res.status(404).json({
        massage: "can not find result  worker id by filter  ! " + err,
      });
    });

}






//  IO.emit("message"+doc.clientId, { type: "notification", objectOrder: doc });
// {
//   "type": "notification",
//   "objectOrder": {
//       "OrderStatus": "معلق",
//       "_id": "612a9f0982920a1d8cab2066",
//       "IdClient": "61265fa43fdfbe649c5bed65",
//       "IdWorker": "61290e9d570aa23ed8f5ddc8",
//       "serviceName": "فني كميرات مراقبة ",
//       "timeOrder": "2021-08-28T20:39:37.287Z",
//       "createdAt": "2021-08-28T20:39:37.307Z",
//       "updatedAt": "2021-08-28T20:39:37.307Z",
//       "__v": 0
//   }
// }
