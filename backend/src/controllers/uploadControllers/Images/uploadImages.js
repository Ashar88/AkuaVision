const fs = require('fs');

exports.uploadImages= (req, res) => {
    try {
        return res.status(200).send({message: "hello world"})
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error uploading images' });
    }
}
