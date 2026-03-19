import { getTrainingData } from './storageService';
import { getModelInfo } from './aiService';

/**
 * Model Training Manager (Stubbed out due to API integration)
 */

export async function startTraining(onProgress) {
  if (onProgress) {
    onProgress({ status: 'error', message: 'Local training is disabled. Model relies on OpenAI API.' });
  }
  return {
    success: false,
    error: 'Local training disabled due to API integration',
  };
}

export async function evaluateModel(testData) {
  return {
    success: false,
    error: 'Local evaluation disabled',
  };
}

export function augmentTrainingData(images) {
  return images;
}

export async function getTrainingStats() {
  try {
    const trainingData = await getTrainingData();
    const modelInfo = getModelInfo();

    const categoryCounts = {};
    trainingData.labels.forEach(label => {
      categoryCounts[label] = (categoryCounts[label] || 0) + 1;
    });

    return {
      totalSamples: trainingData.images.length,
      categoryCounts,
      modelReady: modelInfo.ready,
      categories: modelInfo.categories,
      provider: modelInfo.provider,
    };
  } catch (error) {
    return {
      totalSamples: 0,
      categoryCounts: {},
      modelReady: false,
    };
  }
}

export async function exportModel() {
  return {
    success: false,
    error: 'Model export disabled (using remote API)',
  };
}

export function scheduleRetraining(interval = 86400000) {
  return {
    success: false,
    error: 'Automatic retraining disabled',
  };
}

export async function needsRetraining() {
  return {
    needsRetraining: false,
    reasons: {
      hasEnoughNewSamples: false,
      isImbalanced: false,
    },
    stats: await getTrainingStats(),
  };
}
