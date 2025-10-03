// Image loading utilities for better performance and reliability

class ImageLoadQueue {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.queue = [];
    this.loading = new Set();
  }

  async loadImage(src) {
    return new Promise((resolve, reject) => {
      this.queue.push({ src, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.loading.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { src, resolve, reject } = this.queue.shift();
    this.loading.add(src);

    const img = new Image();
    
    img.onload = () => {
      this.loading.delete(src);
      resolve(src);
      this.processQueue(); // Process next in queue
    };

    img.onerror = () => {
      this.loading.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
      this.processQueue(); // Process next in queue
    };

    // Add delay between concurrent loads to prevent overwhelming server
    setTimeout(() => {
      img.src = src;
    }, this.loading.size * 100); // Stagger by 100ms per concurrent load
  }
}

// Global image loader instance
const globalImageLoader = new ImageLoadQueue(2); // Limit to 2 concurrent loads

export { globalImageLoader };

// Preload critical images
export const preloadImages = async (imageUrls, options = {}) => {
  const { 
    batchSize = 3, 
    delay = 500,
    onProgress = null 
  } = options;

  const batches = [];
  for (let i = 0; i < imageUrls.length; i += batchSize) {
    batches.push(imageUrls.slice(i, i + batchSize));
  }

  let loadedCount = 0;
  const results = [];

  for (const batch of batches) {
    const promises = batch.map(async (url) => {
      try {
        await globalImageLoader.loadImage(url);
        loadedCount++;
        if (onProgress) onProgress(loadedCount, imageUrls.length);
        return { url, success: true };
      } catch (error) {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, imageUrls.length);
        return { url, success: false, error: error.message };
      }
    });

    const batchResults = await Promise.allSettled(promises);
    results.push(...batchResults.map(result => result.value));

    // Add delay between batches
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return results;
};

// Image URL validation and fallback
export const getValidImageUrl = (imageUrl, fallbackUrl = null) => {
  if (!imageUrl) return fallbackUrl;
  
  // Handle relative URLs
  if (imageUrl.startsWith('/')) {
    const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
    return `${baseUrl}${imageUrl}`;
  }
  
  // Handle absolute URLs
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Default fallback
  return fallbackUrl;
};