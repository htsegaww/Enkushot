// AI Image Analysis Service using Hugging Face API (free tier)
// You can sign up at https://huggingface.co/settings/tokens for a free API key

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';

// Predefined categories for image classification
export const CATEGORIES = [
  { id: 'people', label: 'People', emoji: '👥' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'food', label: 'Food', emoji: '🍔' },
  { id: 'animals', label: 'Animals', emoji: '🐾' },
  { id: 'architecture', label: 'Architecture', emoji: '🏛️' },
  { id: 'transportation', label: 'Transportation', emoji: '🚗' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'other', label: 'Other', emoji: '📷' },
];

// Fallback: Client-side simple image analysis (works without API key)
const analyzeImageLocally = async (imageUrl) => {
  try {
    // For now, we'll return a default category
    // In a real implementation, you could use TensorFlow.js for local classification
    return {
      category: 'other',
      tags: ['photo', 'image'],
      confidence: 0.5
    };
  } catch (error) {
    console.error('Local analysis error:', error);
    return {
      category: 'other',
      tags: ['photo'],
      confidence: 0
    };
  }
};

// Analyze image using Hugging Face Image Classification API
export const analyzeImage = async (imageUrl) => {
  // If no API key, use local analysis
  if (!HF_API_KEY) {
    console.log('No Hugging Face API key found. Add VITE_HUGGINGFACE_API_KEY to .env for AI detection.');
    console.log('Get your free API key at: https://huggingface.co/settings/tokens');
    return analyzeImageLocally(imageUrl);
  }

  try {
    console.log('🤖 Analyzing image with AI:', imageUrl);
    
    // Fetch image as blob with CORS mode
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    console.log('✓ Image fetched, size:', blob.size, 'bytes');

    // Call Hugging Face API
    const apiResponse = await fetch(
      'https://api-inference.huggingface.co/models/google/vit-base-patch16-224',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
        body: blob,
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`API request failed: ${apiResponse.status} - ${errorText}`);
    }

    const result = await apiResponse.json();
    console.log('✓ AI results:', result);
    
    // Process results to extract category and tags
    const topResult = result[0];
    const category = mapLabelToCategory(topResult.label);
    const tags = result.slice(0, 3).map(r => r.label.toLowerCase());

    console.log('✓ Detected category:', category, '| Tags:', tags);

    return {
      category,
      tags,
      confidence: topResult.score,
      rawResults: result.slice(0, 5)
    };
  } catch (error) {
    console.error('❌ AI analysis error:', error);
    return analyzeImageLocally(imageUrl);
  }
};

// Map AI labels to our predefined categories
const mapLabelToCategory = (label) => {
  const lowerLabel = label.toLowerCase();
  
  // People-related keywords
  if (lowerLabel.includes('person') || lowerLabel.includes('face') || 
      lowerLabel.includes('human') || lowerLabel.includes('portrait') ||
      lowerLabel.includes('selfie') || lowerLabel.includes('group')) {
    return 'people';
  }
  
  // Nature keywords
  if (lowerLabel.includes('tree') || lowerLabel.includes('flower') || 
      lowerLabel.includes('mountain') || lowerLabel.includes('forest') ||
      lowerLabel.includes('landscape') || lowerLabel.includes('beach') ||
      lowerLabel.includes('ocean') || lowerLabel.includes('sky') ||
      lowerLabel.includes('sunset') || lowerLabel.includes('plant')) {
    return 'nature';
  }
  
  // Food keywords
  if (lowerLabel.includes('food') || lowerLabel.includes('meal') || 
      lowerLabel.includes('dish') || lowerLabel.includes('restaurant') ||
      lowerLabel.includes('pizza') || lowerLabel.includes('burger') ||
      lowerLabel.includes('fruit') || lowerLabel.includes('drink') ||
      lowerLabel.includes('coffee') || lowerLabel.includes('dessert')) {
    return 'food';
  }
  
  // Animals keywords
  if (lowerLabel.includes('dog') || lowerLabel.includes('cat') || 
      lowerLabel.includes('bird') || lowerLabel.includes('animal') ||
      lowerLabel.includes('pet') || lowerLabel.includes('wildlife')) {
    return 'animals';
  }
  
  // Architecture keywords
  if (lowerLabel.includes('building') || lowerLabel.includes('house') || 
      lowerLabel.includes('architecture') || lowerLabel.includes('bridge') ||
      lowerLabel.includes('tower') || lowerLabel.includes('structure') ||
      lowerLabel.includes('city') || lowerLabel.includes('street')) {
    return 'architecture';
  }
  
  // Transportation keywords
  if (lowerLabel.includes('car') || lowerLabel.includes('vehicle') || 
      lowerLabel.includes('bike') || lowerLabel.includes('plane') ||
      lowerLabel.includes('train') || lowerLabel.includes('boat') ||
      lowerLabel.includes('motorcycle') || lowerLabel.includes('transport')) {
    return 'transportation';
  }
  
  // Technology keywords
  if (lowerLabel.includes('computer') || lowerLabel.includes('phone') || 
      lowerLabel.includes('laptop') || lowerLabel.includes('screen') ||
      lowerLabel.includes('device') || lowerLabel.includes('electronic') ||
      lowerLabel.includes('gadget') || lowerLabel.includes('tech')) {
    return 'technology';
  }
  
  // Sports keywords
  if (lowerLabel.includes('sport') || lowerLabel.includes('ball') || 
      lowerLabel.includes('game') || lowerLabel.includes('player') ||
      lowerLabel.includes('stadium') || lowerLabel.includes('athletic')) {
    return 'sports';
  }
  
  // Art keywords
  if (lowerLabel.includes('art') || lowerLabel.includes('painting') || 
      lowerLabel.includes('sculpture') || lowerLabel.includes('gallery') ||
      lowerLabel.includes('museum') || lowerLabel.includes('canvas') ||
      lowerLabel.includes('drawing')) {
    return 'art';
  }
  
  return 'other';
};

// Batch analyze images (with rate limiting)
export const analyzeImagesInBatch = async (images, onProgress) => {
  const results = [];
  const batchSize = 5; // Process 5 at a time to avoid rate limits
  
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    const batchPromises = batch.map(async (image) => {
      const analysis = await analyzeImage(image.url);
      return {
        imageId: image.id,
        ...analysis
      };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    if (onProgress) {
      onProgress(Math.min(i + batchSize, images.length), images.length);
    }
    
    // Wait a bit between batches to avoid rate limiting
    if (i + batchSize < images.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
};

export default {
  analyzeImage,
  analyzeImagesInBatch,
  CATEGORIES
};
