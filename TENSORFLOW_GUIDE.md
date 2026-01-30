# TensorFlow Model Training Guide

This guide explains how the TensorFlow model training works in the Eco-Sorter AI app and how to customize it.

## Overview

The app uses TensorFlow.js for React Native to perform on-device machine learning. The model is a Convolutional Neural Network (CNN) designed to classify waste into 6 categories:

1. Plastic
2. Paper
3. Metal
4. Glass
5. Organic
6. Other

## Model Architecture

### Layers

```javascript
Input Layer: 224x224x3 (RGB images)
↓
Conv2D (32 filters, 3x3 kernel, ReLU)
↓
MaxPooling2D (2x2)
↓
Conv2D (64 filters, 3x3 kernel, ReLU)
↓
MaxPooling2D (2x2)
↓
Conv2D (128 filters, 3x3 kernel, ReLU)
↓
MaxPooling2D (2x2)
↓
Flatten
↓
Dense (128 units, ReLU)
↓
Dropout (0.5)
↓
Dense (6 units, Softmax)
```

### Compilation

- **Optimizer**: Adam (learning rate: 0.001)
- **Loss Function**: Categorical Crossentropy
- **Metrics**: Accuracy

## How Training Works

### 1. Data Collection

The app automatically collects training data when:
- A classification has confidence ≥ 80%
- The result is saved to local storage
- Data is stored in AsyncStorage with image URIs and labels

### 2. Preprocessing

Images are preprocessed before training:
- Resized to 224x224 pixels
- Normalized to [0, 1] range
- Converted to tensors

### 3. Training Process

```javascript
import { startTraining } from './src/services/trainingService';

// Start training with progress callback
const result = await startTraining((progress) => {
  console.log(progress.status, progress.message);
});

if (result.success) {
  console.log('Training completed!');
  console.log('Final accuracy:', result.finalAccuracy);
}
```

### 4. Model Persistence

After training, the model is automatically saved to device storage:
- Location: `${FileSystem.documentDirectory}tfjs_model/`
- Format: TensorFlow.js LayersModel format
- Files: `model.json` and binary weight files

## Customizing the Model

### Changing Architecture

Edit `src/services/aiService.js` in the `createModel()` function:

```javascript
function createModel() {
  const model = tf.sequential();
  
  // Modify layers here
  model.add(tf.layers.conv2d({
    inputShape: [224, 224, 3],
    kernelSize: 3,
    filters: 32,  // Change number of filters
    activation: 'relu',
  }));
  
  // Add more layers...
  
  return model;
}
```

### Changing Hyperparameters

In `src/services/aiService.js`, modify the `trainModel()` function:

```javascript
const history = await model.fit(xs, ys, {
  epochs: 10,           // Change number of epochs
  batchSize: 32,        // Change batch size
  validationSplit: 0.2, // Change validation split
  callbacks: {
    onEpochEnd: (epoch, logs) => {
      console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`);
    },
  },
});
```

### Adding Categories

To add more waste categories:

1. Update the `CATEGORIES` array in `src/services/aiService.js`:
```javascript
const CATEGORIES = [
  'Plastic', 
  'Paper', 
  'Metal', 
  'Glass', 
  'Organic', 
  'Other',
  'Electronic',  // New category
  'Textile',     // New category
];
```

2. Update the output layer in `createModel()`:
```javascript
model.add(tf.layers.dense({
  units: CATEGORIES.length,  // Automatically adjusts
  activation: 'softmax',
}));
```

## Training Best Practices

### 1. Data Quality

- Collect diverse images for each category
- Ensure good lighting and clear visibility
- Include various angles and distances
- Minimum 100 samples per category recommended

### 2. Data Balance

Check category distribution:
```javascript
import { getTrainingStats } from './src/services/trainingService';

const stats = await getTrainingStats();
console.log(stats.categoryCounts);
```

Aim for balanced data across categories.

### 3. Data Augmentation

Currently not implemented, but you can add:
- Image rotation
- Horizontal/vertical flipping
- Brightness adjustment
- Zoom/crop variations

Implement in `src/services/trainingService.js`:
```javascript
export function augmentTrainingData(images) {
  const augmented = [];
  
  images.forEach(image => {
    augmented.push(image);  // Original
    augmented.push(flipHorizontal(image));
    augmented.push(rotate(image, 90));
    augmented.push(adjustBrightness(image, 1.2));
  });
  
  return augmented;
}
```

### 4. Monitoring Training

Monitor training progress:
```javascript
await model.fit(xs, ys, {
  epochs: 10,
  callbacks: {
    onEpochEnd: (epoch, logs) => {
      console.log(`Epoch ${epoch + 1}:`);
      console.log(`  Loss: ${logs.loss.toFixed(4)}`);
      console.log(`  Accuracy: ${logs.acc.toFixed(4)}`);
      console.log(`  Val Loss: ${logs.val_loss.toFixed(4)}`);
      console.log(`  Val Accuracy: ${logs.val_acc.toFixed(4)}`);
    },
  },
});
```

## Transfer Learning (Advanced)

For better performance, use a pre-trained model like MobileNet:

```javascript
import * as mobilenet from '@tensorflow-models/mobilenet';

async function loadPretrainedModel() {
  // Load MobileNet
  const baseModel = await mobilenet.load({
    version: 2,
    alpha: 1.0,
  });
  
  // Remove top layers
  const layer = baseModel.model.getLayer('conv_pw_13_relu');
  const truncatedModel = tf.model({
    inputs: baseModel.model.inputs,
    outputs: layer.output,
  });
  
  // Add custom classification layers
  const model = tf.sequential();
  model.add(truncatedModel);
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({
    units: 128,
    activation: 'relu',
  }));
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({
    units: CATEGORIES.length,
    activation: 'softmax',
  }));
  
  // Freeze base model layers
  truncatedModel.trainable = false;
  
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  
  return model;
}
```

## Evaluation

Evaluate model performance:

```javascript
import { evaluateModel } from './src/services/trainingService';

const testData = { /* test images and labels */ };
const metrics = await evaluateModel(testData);

console.log('Accuracy:', metrics.accuracy);
console.log('Precision:', metrics.precision);
console.log('Recall:', metrics.recall);
console.log('F1 Score:', metrics.f1Score);
```

## Automatic Retraining

The app can automatically trigger retraining:

```javascript
import { needsRetraining, startTraining } from './src/services/trainingService';

async function checkAndRetrain() {
  const check = await needsRetraining();
  
  if (check.needsRetraining) {
    console.log('Retraining needed:', check.reasons);
    await startTraining();
  }
}

// Check daily
setInterval(checkAndRetrain, 86400000);
```

## Exporting Models

Export trained model for deployment:

```javascript
import { exportModel } from './src/services/trainingService';

const result = await exportModel();
if (result.success) {
  console.log('Model exported successfully');
}
```

## Performance Optimization

### 1. Model Size

- Use fewer layers for faster inference
- Reduce filter counts
- Use depthwise separable convolutions

### 2. Inference Speed

- Batch predictions when possible
- Use WebGL backend (enabled by default)
- Dispose tensors after use to free memory

### 3. Memory Management

```javascript
// Always dispose tensors
const tensor = tf.tensor([1, 2, 3]);
// ... use tensor
tensor.dispose();

// Or use tf.tidy
tf.tidy(() => {
  const a = tf.tensor([1, 2, 3]);
  const b = tf.tensor([4, 5, 6]);
  const c = a.add(b);
  return c;
});
```

## Troubleshooting

### Issue: Out of memory errors

**Solution**: 
- Reduce batch size
- Use smaller images
- Dispose tensors properly
- Reduce model complexity

### Issue: Training too slow

**Solution**:
- Reduce number of epochs
- Increase batch size
- Use simpler model architecture
- Enable GPU acceleration

### Issue: Poor accuracy

**Solution**:
- Collect more training data
- Balance dataset
- Add data augmentation
- Tune hyperparameters
- Try transfer learning

## Resources

- TensorFlow.js Documentation: https://www.tensorflow.org/js
- TensorFlow.js Models: https://github.com/tensorflow/tfjs-models
- Model Training Guide: https://www.tensorflow.org/js/guide/train_models
- Performance Best Practices: https://www.tensorflow.org/js/guide/platform_environment
