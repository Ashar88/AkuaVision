import React, { useState } from 'react';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Image } from 'antd';
import "./app.css";
const { Dragger } = Upload;

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

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };


  const handleChange = (info) => {
    setFileList(info.fileList);
    console.log(info)
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


  const imagesToReview = [
    {
      src:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      preview:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      width: 150,
      placeholder: true,
      name:"bablu class"
    }
  ];

  console.log(fileList)
  return (
    <div className="App">
      <div className='cont1'>
        <h2 className="header">File Upload</h2>
        <Dragger
          name="file"
          multiple
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          beforeUpload={(file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              message.error(`${file.name} is not an image file.`);
              return false;
            }
            return isImage;
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
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
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




      {fileList.length > 0 &&

      <div className='cont2'>
        <h2 className="header">Processed Result</h2>
        <div className='container2'>
          {fileList.map((file) => (
            <div key={file.uid} className="file-container">
              <Image
                width={150}
                src={file.src || file.thumbUrl}
                preview={file.thumbUrl}
                alt={file.name}
                placeholder= {file.placeholder}
                download={file.url || file.thumbUrl}
              />
              <span className="file-name">{file.name}</span>
            </div>
          ))}
        </div>
      </div>

      } 
    </div>
  );
};

export default App;