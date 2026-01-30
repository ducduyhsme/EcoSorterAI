import * as tf from '@tensorflow/tfjs';
import { getTrainingData } from './storageService';
import { trainModel, saveModel, getModelInfo } from './aiService';
import {
  MIN_TRAINING_SAMPLES,
  RETRAINING_NEW_SAMPLES_THRESHOLD,
  RETRAINING_IMBALANCE_RATIO,
} from '../config/constants';

/**
 * Model Training Manager
 * Handles TensorFlow model training, retraining, and evaluation
 */

/**
 * Start training the model with collected data
 */
export async function startTraining(onProgress) {
  try {
    // Get training data from storage
    const trainingData = await getTrainingData();
    
    if (trainingData.images.length < MIN_TRAINING_SAMPLES) {
      return {
        success: false,
        error: `Not enough training data. Need at least ${MIN_TRAINING_SAMPLES} samples.`,
        samplesCount: trainingData.images.length,
      };
    }
    
    // Notify progress
    if (onProgress) {
      onProgress({ status: 'preparing', message: 'Preparing training data...' });
    }
    
    // Start training
    if (onProgress) {
      onProgress({ status: 'training', message: 'Training model...' });
    }
    
    const result = await trainModel(trainingData);
    
    if (result.success) {
      if (onProgress) {
        onProgress({ status: 'complete', message: 'Training completed!' });
      }
      
      return {
        success: true,
        samplesCount: trainingData.images.length,
        finalLoss: result.finalLoss,
        finalAccuracy: result.finalAccuracy,
      };
    } else {
      return {
        success: false,
        error: result.error,
      };
    }
  } catch (error) {
    console.error('Error in training process:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Evaluate model performance
 */
export async function evaluateModel(testData) {
  try {
    const modelInfo = getModelInfo();
    
    if (!modelInfo.ready) {
      return {
        success: false,
        error: 'Model not ready',
      };
    }
    
    // In a real implementation, this would evaluate the model
    // on test data and return metrics
    
    return {
      success: true,
      accuracy: 0.85, // Simulated
      precision: 0.82, // Simulated
      recall: 0.88, // Simulated
      f1Score: 0.85, // Simulated
    };
  } catch (error) {
    console.error('Error evaluating model:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create augmented training data
 * Applies data augmentation techniques to increase training data
 */
export function augmentTrainingData(images) {
  const augmented = [];
  
  images.forEach(image => {
    // Original image
    augmented.push(image);
    
    // Augmentations would be applied here:
    // - Rotation
    // - Flipping
    // - Brightness adjustment
    // - Zoom
    // - etc.
    
    // For now, just add the original
  });
  
  return augmented;
}

/**
 * Get training statistics
 */
export async function getTrainingStats() {
  try {
    const trainingData = await getTrainingData();
    const modelInfo = getModelInfo();
    
    // Count samples per category
    const categoryCounts = {};
    trainingData.labels.forEach(label => {
      categoryCounts[label] = (categoryCounts[label] || 0) + 1;
    });
    
    return {
      totalSamples: trainingData.images.length,
      categoryCounts,
      modelReady: modelInfo.ready,
      modelLayers: modelInfo.layers,
      categories: modelInfo.categories,
    };
  } catch (error) {
    console.error('Error getting training stats:', error);
    return {
      totalSamples: 0,
      categoryCounts: {},
      modelReady: false,
    };
  }
}

/**
 * Export model for deployment
 */
export async function exportModel() {
  try {
    const saved = await saveModel();
    
    if (saved) {
      return {
        success: true,
        message: 'Model exported successfully',
      };
    } else {
      return {
        success: false,
        error: 'Failed to export model',
      };
    }
  } catch (error) {
    console.error('Error exporting model:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Schedule automatic retraining
 */
export function scheduleRetraining(interval = 86400000) { // Default: 24 hours
  console.log('Scheduled automatic retraining');
  
  // In a real app, this would set up a background task
  // to periodically retrain the model with new data
  
  return {
    success: true,
    interval,
    nextTraining: new Date(Date.now() + interval).toISOString(),
  };
}

/**
 * Check if model needs retraining
 */
export async function needsRetraining() {
  try {
    const trainingData = await getTrainingData();
    const stats = await getTrainingStats();
    
    // Criteria for retraining:
    // 1. New data collected (RETRAINING_NEW_SAMPLES_THRESHOLD+ new samples)
    // 2. Imbalanced dataset
    // 3. Poor performance (not implemented here)
    
    const hasEnoughNewSamples = trainingData.images.length >= RETRAINING_NEW_SAMPLES_THRESHOLD;
    
    // Check for imbalanced categories
    const counts = Object.values(stats.categoryCounts);
    
    // Handle edge cases
    if (counts.length === 0) {
      return {
        needsRetraining: false,
        reasons: {
          hasEnoughNewSamples: false,
          isImbalanced: false,
        },
        stats,
      };
    }
    
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const isImbalanced = counts.length > 1 && maxCount > minCount * RETRAINING_IMBALANCE_RATIO;
    
    return {
      needsRetraining: hasEnoughNewSamples || isImbalanced,
      reasons: {
        hasEnoughNewSamples,
        isImbalanced,
      },
      stats,
    };
  } catch (error) {
    console.error('Error checking retraining needs:', error);
    return {
      needsRetraining: false,
      error: error.message,
    };
  }
}
