module.exports = uploadImages = (req, res) => {
    try {
        console.log(req)
        const uploadedFiles = req.files;
        console.log(uploadedFiles)

        uploadedFiles.forEach((file) => {
            console.log(`Uploaded file: ${file.originalname}`);
        });

        return res.status(200).send({message: "hello world"})
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error uploading images' });
    }
}
