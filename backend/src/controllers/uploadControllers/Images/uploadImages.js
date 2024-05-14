const fs = require('fs');
const { spawn } = require('child_process');

exports.uploadImages= async (req, res) => {
    try {
        const imagesPath = req.files.map((file) => "/usr/src/app/"+file.path)
        const model_path = '/usr/src/app/python/yolov8_weights/best.pt'
        const conf_thresh = 0.5 
        const pythonScriptPath = "/usr/src/app/python/Images/images.py"

        const pythonProcess = spawn('python', [pythonScriptPath, imagesPath, model_path, conf_thresh ]);

        const pythonOutput = new Promise((resolve, reject) => {
            let outputData = "";
            pythonProcess.stdout.on('data', (data) => {
                outputData += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                reject(data.toString());
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(outputData);
                } else {
                    reject(new Error(`Python script exited with code ${code}`));
                }
            });
        });

        const result = pythonOutput;
        console.log("got the response from python file: ", result);

        console.log("inside the node js")
        return res.status(200).send({message: "hello world"})


    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error uploading images' });
    }
}


exports.isFileAvailable= (req, res) => {
    console.log(req.query.filename)
    if (fs.existsSync("/usr/src/app"+req.query.filename)) {
        return res.send(true)
    }
    else return res.send(false)
}
