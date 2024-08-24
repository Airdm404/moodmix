'use client'

import React, { useState, useRef, useContext } from "react";
import { useRouter } from 'next/navigation';
import {Camera} from "react-camera-pro";
import styled from 'styled-components';
import Image from 'next/image';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { ImageContext } from '../context/context';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase'; 




const Wrapper = styled.div`
  position: absolute;
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;

const Control = styled.div`
  position: absolute;
  display: flex;
  right: 0;
  width: 20%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;
  flex-direction: column-reverse;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: row;
    bottom: 0;
    width: 100%;
    height: 20%;
  }

  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const Button = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;

  &:hover {
    opacity: 0.7;
  }
`;


const TakePhotoButton = styled(Button)`
  background: url('https://img.icons8.com/ios/50/000000/compact-camera.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;


const ChangeFacingCameraButton = styled(Button)`
  background: url(https://img.icons8.com/ios/50/000000/switch-camera.png);
  background-position: center;
  background-size: 40px;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  padding: 40px;
  &:disabled {
    opacity: 0;
    cursor: default;
    padding: 60px;
  }
  @media (max-width: 400px) {
    padding: 40px 5px;
    &:disabled {
      padding: 40px 25px;
    }
  }
`;



const CameraPage = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const { setImage: setImageInContext } = useContext(ImageContext); 
  const router = useRouter();



  const handleSendImage = async () => {
    if (image) {

      const storageRef = ref(storage, `images/${Date.now()}.jpg`);
      try {
        // Upload the base64 image string
        const snapshot = await uploadString(storageRef, image, 'data_url');
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Pass the URL to the home page
        setImageInContext(downloadURL);
        router.push('/');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };




  return (
    <Box
    width='100vw'
    minHeight='100vh'
    display={'flex'}
    >
        <Wrapper>
            <Camera ref={camera} 
            aspectRatio="cover"
            numberOfCamerasCallback={setNumberOfCameras} 
            errorMessages={{
                noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera:
                'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
            }}

            videoReadyCallback={() => {
                console.log('Video feed ready.');
            }}
        
            
            />

            <Control>

                {image && (
                <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                    <Image
                    src={image}
                    alt="Preview"
                    fill
                    style={{
                        objectFit: 'contain',
                        borderRadius: '8px',
                    }}
                    />
                </div>
                )}

                {image && (
                    <IconButton onClick={handleSendImage} color="primary">
                        <SendIcon style={{ fontSize: '2rem', color: '#fff' }} />
                    </IconButton>
                )}



                <TakePhotoButton
                    onClick={() => {
                        if (camera.current) {
                            const photo = camera.current.takePhoto();
                            console.log('Captured Photo:', photo); 
                            setImage(photo);
                        }
                    }}
                />

                <ChangeFacingCameraButton
                    disabled={numberOfCameras <= 1}
                    onClick={() => {
                        if (camera.current) {
                            const result = camera.current.switchCamera();
                            console.log(result);
                        }
                    }}
                />
                
            </Control>
        </Wrapper>

    </Box>


  );
};

export default CameraPage;