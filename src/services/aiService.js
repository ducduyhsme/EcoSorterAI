import * as FileSystem from 'expo-file-system';
import { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL } from '@env';

// Waste categories
const CATEGORIES = ['Organic', 'Inorganic'];

let isModelReady = false;

/**
 * Initialize model config (stubs the local TF init)
 */
export async function initializeModel() {
  try {
    if (!OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY is not set in .env');
    }
    isModelReady = true;
    console.log('OpenAI API config initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing API config:', error);
    isModelReady = true;
    return false;
  }
}

/**
 * Classify an image using the OpenAI API
 */
export async function classifyImage(imageUri) {
  if (!isModelReady) {
    await initializeModel();
  }

  try {
    // Read local image as Base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const body = {
      model: OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an environmental assistant specialized in waste classification. You classify images into one of two categories: "Organic" or "Inorganic". Respond ONLY with a raw JSON object containing exactly two keys: "Category" (string, either "Organic" or "Inorganic") and "Confidence" (number between 0 and 1 representing your confidence). No markdown backticks or other text.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Classify this waste item. Respond with JSON.' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 150,
      temperature: 0,
    };

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const result = JSON.parse(content);
    
    // Extract keys gracefully regardless of case (supports "Category" or "category")
    let category = result.category || result.Category || result.CATEGORY;
    let confidence = result.confidence !== undefined ? result.confidence : (result.Confidence !== undefined ? result.Confidence : result.CONFIDENCE);

    // Ensure category is valid, otherwise default to Inorganic with low confidence
    if (!CATEGORIES.includes(category)) {
      category = 'Inorganic';
      confidence = 0.5;
    }

    // Mock allProbabilities for the UI which expects it based on local model
    const allProbabilities = CATEGORIES.map(c => (c === category ? confidence : 1 - confidence));

    return {
      category,
      confidence,
      allProbabilities,
    };
  } catch (error) {
    console.error('Error classifying image via API:', error);

    // Return a fallback classification as fallback
    return {
      category: 'Inorganic',
      confidence: 0,
      allProbabilities: [0.5, 0.5],
    };
  }
}

/**
 * Stub values for features that are no longer supported via local ML
 */
export async function trainModel(trainingData) {
  console.log('Local training disabled. AI model relies on remote API.');
  return { success: false, error: 'Local training disabled due to API integration' };
}

export async function saveModel() {
  return true;
}

export function getModelInfo() {
  return {
    ready: isModelReady,
    categories: CATEGORIES,
    layers: 0,
    trainable: false,
    provider: 'OpenAI API'
  };
}
