import React, { useState, useEffect } from 'react';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Image, Space, Button } from 'antd';
import "./app.css";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
const { Dragger } = Upload;
import axios from 'axios';


const backendUploadURL = "http://localhost:8888/api/images/upload"
const isFileAvaliableURL = "http://localhost:8889/api/isFileAvaliable"



const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const App = () => {
  const [random, setRandom] = useState();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);


  useEffect(() => {
    const validateImages = async () => {
      const imageUrls = fileList.map((file) => {
        const imageUrl = `/processed/${file.uid}_${file.name}`;
        return { imageUrl, thumbUrl: file.thumbUrl };
      });

      const processed = [];
      for (const img of imageUrls) {
        const response = await axios.get(isFileAvaliableURL + "?filename=" + img.imageUrl);
        if (response.data === true) {
          processed.push(img);
        } else {
          console.log(`Image not found or processing failed: ${img.imageUrl}`);
        }
      }

      // console.log("processed", processed)
      setProcessedImages(processed);
      // console.log("processedImages", processedImages)
    };

    validateImages();
    const intervalId = setInterval(validateImages, 1000);
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


  const onDownload = (imageURL) => {
    fetch(imageURL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.download = "Processed_" + imageURL.replace(imageURL.split('_')[0] + '_', '');
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
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
        {processedImages.length !== fileList.length && (
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
          <Space size={12}>
            {processedImages.map(({ imageUrl, thumbUrl }) => (
              <div key={imageUrl} className="file-container">

              <Image
                width={150}
                height={100}
                src={imageUrl}
                preview={{
                  toolbarRender: (
                      _,
                      {
                        transform: { scale },
                        actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                      },
                    ) => (
                      <Space size={15} className="toolbar-wrapper">
                        <DownloadOutlined onClick={() => onDownload(imageUrl)} />
                        <SwapOutlined rotate={90} onClick={onFlipY} />
                        <SwapOutlined onClick={onFlipX} />
                        <RotateLeftOutlined onClick={onRotateLeft} />
                        <RotateRightOutlined onClick={onRotateRight} />
                        <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                        <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                      </Space>
                    ),
                  }}
                  fallback={thumbUrl}
              />
              <span className="file-name">{imageUrl.replace(imageUrl.split('_')[0]+'_','')}</span>
            </div>
          ))}
          </Space>
          <Button
            type="primary"
            onClick={() => {
              setRandom(Date.now());
            }}
          >
            Reload
          </Button>
        </div>
      </div>

      } 
    </div>
  );
};

export default App;