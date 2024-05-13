const Images = require('@/controllers/uploadControllers/Images/uploadImages');
let imageController = {};



imageController.uploadImages = (req, res)=>{
    return Images.uploadImages(req, res)
}
imageController.getProcessedImage = (req, res)=>{
    return Images.getProcessedImage(req, res)
}


module.exports = imageController;
