import React, { useState, useEffect } from 'react';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Image } from 'antd';
import "./app.css";
const { Dragger } = Upload;

const backendUploadURL = "http://localhost:8888/api/images/upload"

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const App = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);


  useEffect(() => {
    const validateImages = async () => {
      const imageUrls = fileList.map((file) => {
        // const imageUrl = `/public/uploads/${file.uid}-${file.name}`;
        const imageUrl = `uploads/rc-upload-1715546659832-17_Screenshot from 2024-05-03 21-33-33.png`;
        return imageUrl;
      });
      const imagePromises = imageUrls.map(async (imageUrl) => {
        const response = await fetch(imageUrl);
        if (response.ok) return imageUrl;
        else return null;
      });
      const processed = await Promise.all(imagePromises);
      setProcessedImages(processed.filter(Boolean));
    };

    validateImages();
    const intervalId = setInterval(validateImages, 2000);
    return () => clearInterval(intervalId);
  }, [fileList]);


  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };


  const handleChange = (info) => {
    setFileList(info.fileList);
    if (info.file.status === 'uploading') {
      setProcessing(true);
    } else if (info.file.status === 'done') {
      setProcessing(false);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === 'error') {
      setProcessing(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };


  return (
    <div className="App">
      <div className='cont1'>
        <h2 className="header">File Upload</h2>
        <Dragger
          name="file"
          multiple
          beforeUpload={(file) => {
            const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error(`${file.name} is not an image file.`);
                return false;
              }
              return file
          }}
          customRequest ={(componentsData) => {
                let formData = new FormData();
                formData.append('file', componentsData.file);

                fetch(backendUploadURL + '?uid=' + componentsData.file.uid, {
                method: 'POST',
                headers: {
                  contentType: "multipart/form-data"
                },
                body: formData
              })
            .then(response => response.json())
            .then(data => data.data)
            .then(data=> componentsData.onSuccess())
            .catch(error => {
                  console.log('Error fetching profile ' + error)
                componentsData.onError("Error uploading image")
              })      
        }}
          onChange={handleChange}
          listType="picture"
          fileList={fileList}
          onPreview={handlePreview}
          className="parent"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag Images to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk images upload.
          </p>
        </Dragger>
        {processing && (
          <div className="loading-placeholder">
            <p>Processing...</p>
          </div>
        )}
        {fileList?.length > 0 && !processing && (
          <Image
            src={fileList[0].url}
          />
        )}
        {previewImage && (
          <Image
            wrapperStyle={{
              display: 'none',
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
      </div>





      {processedImages.length > 0 &&

      <div className='cont2'>
        <h2 className="header">Processed Result</h2>
        <div className='container2'>
            {processedImages.map((fileName) => (
              <div key={fileName} className="file-container">
              <Image
                width={150}
                src= {fileName}
                // preview={file.thumbUrl}
                // alt={file.name}
                // placeholder= {file.placeholder}
                // download={fileName}
              />
              <span className="file-name">{fileName.split('_')[1]}</span>
            </div>
          ))}
        </div>
      </div>

      } 
    </div>
  );
};

export default App;