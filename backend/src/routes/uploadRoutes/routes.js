const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const ImageController = require('@/controllers/uploadControllers/imageController');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, req.query.uid + '_' + file.originalname)
    }
})

const ImageUpload = multer({ storage: storage })


router.route('/images/upload').post(ImageUpload.array('file'), catchErrors(ImageController.uploadImages));
// router.route('/images/processed').get(ImageController.getProcessedImage);

module.exports = router;
