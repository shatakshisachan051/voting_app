import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceVerification = ({ onVerified, onError, storedPhotoUrl }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);

  const startVideo = async () => {
    try {
      if (!videoRef.current) {
        throw new Error('Video element not ready');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });
      videoRef.current.srcObject = stream;
      setIsCameraReady(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      throw new Error('Failed to access camera. Please check camera permissions and try again.');
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingStatus('Initializing face detection...');
        
        // Check WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          throw new Error('WebGL is not supported. Face verification requires WebGL support.');
        }

        const MODEL_URL = `${import.meta.env.VITE_API_URL}/models/face-api`;
        console.log('Loading models from:', MODEL_URL);

        // Load models one by one with error handling
        try {
          setLoadingStatus('Loading face detection model...');
          await faceapi.nets.ssdMobilenetv1.loadFromUri(`${MODEL_URL}`);
          console.log('Face detection model loaded successfully');
        } catch (err) {
          console.error('Error loading face detection model:', err);
          throw new Error('Failed to load face detection model. Please check your internet connection and try again.');
        }

        try {
          setLoadingStatus('Loading facial landmarks model...');
          await faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}`);
          console.log('Facial landmarks model loaded successfully');
        } catch (err) {
          console.error('Error loading facial landmarks model:', err);
          throw new Error('Failed to load facial landmarks model. Please check your internet connection and try again.');
        }

        try {
          setLoadingStatus('Loading face recognition model...');
          await faceapi.nets.faceRecognitionNet.load(`${MODEL_URL}/face_recognition_model-weights_manifest.json`);
          console.log('Face recognition model loaded successfully');
        } catch (err) {
          console.error('Error loading face recognition model:', err);
          throw new Error('Failed to load face recognition model. Please check your internet connection and try again.');
        }

        setLoadingStatus('Starting camera...');
        await startVideo();
        setIsModelLoaded(true);
        setLoadingStatus('');
      } catch (err) {
        console.error('Error initializing face verification:', err);
        onError(err.message || 'Failed to initialize face verification. Please try again.');
        setLoadingStatus('');
      }
    };

    loadModels();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onError]);

  const verifyFace = async () => {
    try {
      if (!videoRef.current || !isModelLoaded || !isCameraReady) {
        throw new Error('Camera or models not ready. Please wait...');
      }

      setLoadingStatus('Loading stored photo...');
      // Load the stored photo
      const photoUrl = storedPhotoUrl.startsWith('/') 
        ? `${import.meta.env.VITE_API_URL}${storedPhotoUrl}`
        : storedPhotoUrl;
      
      console.log('Loading stored photo from:', photoUrl);
      const storedImage = await faceapi.fetchImage(photoUrl);
      
      setLoadingStatus('Analyzing stored photo...');
      const storedDetection = await faceapi.detectSingleFace(storedImage)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!storedDetection) {
        throw new Error('No face detected in stored photo');
      }

      setLoadingStatus('Analyzing camera feed...');
      // Get current face from video
      const detection = await faceapi.detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error('No face detected in camera. Please face the camera directly.');
      }

      setLoadingStatus('Comparing faces...');
      // Compare faces
      const distance = faceapi.euclideanDistance(
        detection.descriptor,
        storedDetection.descriptor
      );

      const THRESHOLD = 0.6;
      if (distance < THRESHOLD) {
        setLoadingStatus('');
        onVerified();
      } else {
        throw new Error('Face verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Face verification error:', err);
      onError(err.message);
      setLoadingStatus('');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        }}
        style={{
          width: '100%',
          maxWidth: '640px',
          height: 'auto',
          marginBottom: '20px',
          transform: 'scaleX(-1)' // Mirror effect
        }}
        onPlay={() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.style.position = 'absolute';
            canvasRef.current.style.left = videoRef.current.offsetLeft + 'px';
            canvasRef.current.style.top = videoRef.current.offsetTop + 'px';
          }
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div style={{ marginBottom: '20px' }}>
        {loadingStatus && (
          <div style={{ 
            color: '#666',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}>
            {loadingStatus}
          </div>
        )}
        
        <button
          onClick={verifyFace}
          disabled={!isModelLoaded || !isCameraReady || loadingStatus}
          style={{
            padding: '10px 20px',
            backgroundColor: !isModelLoaded || !isCameraReady || loadingStatus ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isModelLoaded || !isCameraReady || loadingStatus ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {loadingStatus || (!isCameraReady ? 'Starting Camera...' : isModelLoaded ? 'Verify Face' : 'Loading...')}
        </button>
      </div>
    </div>
  );
};

export default FaceVerification; 