import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import "./app.css";

const { Dragger } = Upload;
const App = () => {

  const [fileList, setFileList] = useState(false);
  const props = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    beforeUpload: (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          message.error(`${file.name} is not an image file.`);
          return false;
        }
        return isImage;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      if(info.fileList.length>0) {setFileList(true); console.log("setfile-true", info.fileList, fileList)}
      else if(info.fileList.length===0) {; setFileList(false); console.log("setfile-false", info.fileList, fileList)}

      console.log(fileList,info.fileList.length ,info.fileList)
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    listType: "picture",
    
  };

return (
  <div className="App">
      <h2 className="header">File Upload</h2>
      <Dragger {...props} className="parent">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
      </Dragger>
  </div>)
}

export default App;
