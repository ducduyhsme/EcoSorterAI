import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const HISTORY_KEY = 'classification_history';
const TRAINING_DATA_KEY = 'training_data';

/**
 * Save a classification result to local storage
 */
export async function saveClassification(classification) {
  try {
    // Get existing history
    const history = await getClassificationHistory();
    
    // Add new classification
    history.unshift(classification);
    
    // Keep only last 100 items
    const trimmedHistory = history.slice(0, 100);
    
    // Save back to storage
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    
    // If high confidence, add to training data
    if (classification.confidence >= 0.8) {
      await addToTrainingData(classification);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving classification:', error);
    return false;
  }
}

/**
 * Get classification history from local storage
 */
export async function getClassificationHistory() {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}

/**
 * Filter history by category
 */
export function filterByCategory(history, category) {
  return history.filter(item => item.category === category);
}

/**
 * Upload image to server for supplementary training
 */
export async function uploadToServer(imageUri, classification) {
  try {
    console.log('Uploading to server for supplementary training...');
    
    // In a real app, this would upload to your server
    // For now, we'll simulate the upload
    
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'waste-image.jpg',
    });
    formData.append('category', classification.category);
    formData.append('confidence', classification.confidence.toString());
    formData.append('timestamp', new Date().toISOString());
    
    // Simulated server endpoint
    // const response = await fetch('https://your-server.com/api/upload', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    
    // For demo, just log the upload
    console.log('Image uploaded to server (simulated)');
    
    return {
      success: true,
      message: 'Uploaded to server for improved classification',
    };
  } catch (error) {
    console.error('Error uploading to server:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Add classification to training data
 */
async function addToTrainingData(classification) {
  try {
    const trainingDataJson = await AsyncStorage.getItem(TRAINING_DATA_KEY);
    let trainingData = trainingDataJson ? JSON.parse(trainingDataJson) : { images: [], labels: [] };
    
    // Add new data
    trainingData.images.push(classification.imageUri);
    trainingData.labels.push(classification.category);
    
    // Keep only last 500 training samples
    if (trainingData.images.length > 500) {
      trainingData.images = trainingData.images.slice(-500);
      trainingData.labels = trainingData.labels.slice(-500);
    }
    
    await AsyncStorage.setItem(TRAINING_DATA_KEY, JSON.stringify(trainingData));
    console.log('Added to training data');
  } catch (error) {
    console.error('Error adding to training data:', error);
  }
}

/**
 * Get training data for model training
 */
export async function getTrainingData() {
  try {
    const trainingDataJson = await AsyncStorage.getItem(TRAINING_DATA_KEY);
    if (trainingDataJson) {
      return JSON.parse(trainingDataJson);
    }
    return { images: [], labels: [] };
  } catch (error) {
    console.error('Error getting training data:', error);
    return { images: [], labels: [] };
  }
}

/**
 * Clear all stored data (for testing/reset)
 */
export async function clearAllData() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    await AsyncStorage.removeItem(TRAINING_DATA_KEY);
    console.log('All data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}

/**
 * Sync with cloud storage (simulated)
 */
export async function syncWithCloud() {
  try {
    console.log('Syncing with cloud storage...');
    
    // Get local history
    const history = await getClassificationHistory();
    
    // In a real app, this would sync with cloud storage (Firebase, AWS S3, etc.)
    // For now, we'll simulate the sync
    
    // Simulated cloud sync
    // const response = await fetch('https://your-server.com/api/sync', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ history }),
    // });
    
    console.log(`Synced ${history.length} items to cloud (simulated)`);
    
    return {
      success: true,
      synced: history.length,
    };
  } catch (error) {
    console.error('Error syncing with cloud:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats() {
  try {
    const history = await getClassificationHistory();
    const trainingData = await getTrainingData();
    
    return {
      totalClassifications: history.length,
      trainingDataSize: trainingData.images.length,
      categories: [...new Set(history.map(item => item.category))],
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      totalClassifications: 0,
      trainingDataSize: 0,
      categories: [],
    };
  }
}
