const Images = require('@/controllers/uploadControllers/Images/uploadImages');
let imageController = {};



imageController.uploadImages = async (req, res)=>{
    return await Images.uploadImages(req, res)
}
imageController.isFileAvailable = (req, res)=>{
    return Images.isFileAvailable(req, res)
}


module.exports = imageController;
