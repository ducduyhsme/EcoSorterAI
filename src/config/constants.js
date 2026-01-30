// Configuration constants for the Eco-Sorter AI app

// Confidence thresholds
export const CONFIDENCE_THRESHOLD_HIGH = 0.8; // For adding to training data
export const CONFIDENCE_THRESHOLD_MEDIUM = 0.7; // For accepting classification
export const CONFIDENCE_THRESHOLD_LOW = 0.7; // For uploading to server

// Storage limits
export const MAX_HISTORY_ITEMS = 100;
export const MAX_TRAINING_SAMPLES = 500;

// Training parameters
export const MIN_TRAINING_SAMPLES = 10;
export const TRAINING_EPOCHS = 10;
export const TRAINING_BATCH_SIZE = 32;
export const TRAINING_VALIDATION_SPLIT = 0.2;

// Points system
export const POINTS_BASE = 10;
export const POINTS_HIGH_CONFIDENCE = 20; // For confidence >= 0.9
export const POINTS_MEDIUM_CONFIDENCE = 10; // For confidence >= 0.7

// Retraining thresholds
export const RETRAINING_NEW_SAMPLES_THRESHOLD = 50;
export const RETRAINING_IMBALANCE_RATIO = 3; // Max/min category ratio
