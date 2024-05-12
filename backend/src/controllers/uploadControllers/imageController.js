const uploadImages = require('@/controllers/uploadControllers/Images/uploadImages');
let imageController = {};



imageController.uploadImages = (req, res)=>{
    return uploadImages(req, res)
}


module.exports = imageController;
