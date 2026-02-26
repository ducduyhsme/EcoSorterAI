import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { classifyImage } from '../services/aiService';
import { saveClassification, uploadToServer } from '../services/storageService';
import { CONFIDENCE_THRESHOLD_LOW } from '../config/constants';

// Calculate the camera preview height based on screen width and 3:4 aspect ratio
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAMERA_HEIGHT = (SCREEN_WIDTH / 3) * 4;

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setCapturedImage(photo.uri);
        await processImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera roll permission is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setIsProcessing(true);
      setCapturedImage(pickerResult.assets[0].uri);
      await processImage(pickerResult.assets[0].uri);
      setIsProcessing(false);
    }
  };

  const processImage = async (imageUri) => {
    try {
      // Classify the image using local AI
      const classification = await classifyImage(imageUri);
      setResult(classification);

      // Save classification to local storage
      await saveClassification({
        imageUri,
        ...classification,
        timestamp: new Date().toISOString(),
      });

      // If confidence is low, upload to server for better classification
      if (classification.confidence < CONFIDENCE_THRESHOLD_LOW) {
        await uploadToServer(imageUri, classification);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to classify image');
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setResult(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Ionicons name="camera-off" size={64} color="#ccc" />
        <Text style={styles.permissionText}>No access to camera</Text>
        <Text style={styles.permissionSubText}>
          Please grant camera permissions in settings
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <>
          {/* Camera wrapper: fixed 3:4 aspect ratio container */}
          <View style={styles.cameraWrapper}>
            {/* Camera preview fills the 3:4 container */}
            <CameraView style={styles.camera} facing={type} ref={cameraRef} />

            {/* Overlay sits ON TOP of camera (absolute positioned) */}
            <View style={styles.cameraOverlay}>
              {/* Instruction text centered on the camera preview */}
              <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                  Point camera at waste item
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom controls: gallery, shutter, and flip button on the same row */}
          <View style={styles.bottomControls}>
            {/* Gallery / pick image button (left) */}
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Ionicons name="images" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Shutter / capture button (center) */}
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isProcessing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            {/* Camera flip button (right) — now same row as shutter */}
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setType(type === 'back' ? 'front' : 'back');
              }}
            >
              <Ionicons name="camera-reverse" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />

          {isProcessing ? (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.processingText}>Analyzing image...</Text>
            </View>
          ) : result ? (
            <View style={styles.resultContainer}>
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Classification Result</Text>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Category:</Text>
                  <Text style={styles.resultValue}>
                    {result.category}
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Confidence:</Text>
                  <Text style={[
                    styles.resultValue,
                    { color: result.confidence >= CONFIDENCE_THRESHOLD_LOW ? '#4CAF50' : '#FF9800' }
                  ]}>
                    {(result.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
                {result.confidence < CONFIDENCE_THRESHOLD_LOW && (
                  <Text style={styles.uploadInfo}>
                    ℹ️ Sent to server for better classification
                  </Text>
                )}
              </View>

              <TouchableOpacity style={styles.doneButton} onPress={resetCapture}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  permissionSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  /* 3:4 aspect ratio wrapper for the camera */
  cameraWrapper: {
    width: SCREEN_WIDTH,
    height: CAMERA_HEIGHT,
    overflow: 'hidden',
  },
  /* Camera fills the entire 3:4 wrapper */
  camera: {
    flex: 1,
  },
  /* Overlay positioned absolutely on top of camera preview */
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  /* Instruction text shown at the bottom of the camera preview */
  instructionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  /* Bottom controls row: gallery (left), shutter (center), flip (right) */
  bottomControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  /* Gallery button (left side) */
  galleryButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Shutter button (center) */
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
  },
  /* Camera flip button (right side) — now level with shutter */
  flipButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  uploadInfo: {
    fontSize: 14,
    color: '#FF9800',
    marginTop: 10,
    fontStyle: 'italic',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});