const jwt = require('jsonwebtoken');
exports.isAuthAdmin = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
        res.status(401).json({
            massage: "access denied  لا يوجد توكن | protect user router "
        })
    }
    // return my data-token if token valid 
    // if token invalid throw Exception 
    try {
        // return verified = user._id , user.userType
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        if(verified. adminPrivilege==="full-admin"){
            // req.admin = verified
            next();
        }else{
            res.status(401).json({
                massage: "Not Admin Authorization or | you sub-admin can not Authorization "
            })
        }
        
    } catch (err) {
        res.status(400).json({
            massage: "token not valid , | redirect login page جلسة غير صالحة اعادة تسجيل دخول  "
        })
    }
}
