const serviceModel = require('../models/service.model')
var multer = require('multer')


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

exports.addService = (req, res, next) => {
    const service = new serviceModel({
        serviceName: req.body.serviceName,
        serviceImage: req.file.filename,
        serviceDescription: req.body.serviceDescription
    })
    service.save().then(doc => {
        res.status(200).json({
            massage: 'successfully save new Service ',
            service: doc
        })
    }).catch(err => {
        res.status(404).json({
            massage: "can not save Service ! ",
            massageFrom: "save service addServices Function ",
            massageErr: err
        })
    })
}
exports.deleteService = (req, res, next) => {
    let idService = req.params.id
    // console.log(idService)
    serviceModel.findByIdAndDelete(idService).then(result => {
        if (result) {
            console.log(result);
            res.status(202).json({
                massage: 'تم حذف هذه الخدمة بنجاح '
            })
        } else {
            // if user already deleted  
            console.log(result);
            res.status(404).json({
                massage: "هذه الخدمة محذوفة مسبقاً",

            })
        }
    }).catch(err => {
        res.status(404).json({
            massageFrom: " delete service catch error ",
            massage: err
        })

    })

}

exports.updateService = (req, res, next) => {
    let idService = req.params.id
    console.log(idService);
    const serves = {
        serviceName: req.body.serviceName,
        serviceImage: req.body.serviceImage,
        serviceDescription: req.body.serviceDescription
    }
    serviceModel.findOneAndUpdate({ _id: idService }, { $set: serves }, { new: true }).then(result => {
        console.log(result);
        if (!result) {
            res.status(404).json({
                massage: "هناك خطاء في الايدي غير صحيح"
            })
        } else {
            console.log("Service after update", result)
            res.status(202).json({
                massage: 'Service  update successfully ',
                service: result
            })
        }
    }).catch(err => {
        res.status(404).json({
            massageFrom: " err catch update service !",
            massage: err

        })
    })



}