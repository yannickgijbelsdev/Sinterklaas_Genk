// Simple image preloader utility to improve loading performance

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (imageUrls) => {
  const promises = imageUrls.map(url => {
    return preloadImage(url).catch(error => {
      console.warn(`Failed to preload image: ${url}`, error);
      return null; // Don't fail the whole batch for one image
    });
  });
  
  return Promise.all(promises);
};

// Preload critical images for better performance
export const preloadCriticalImages = (newsArticles) => {
  if (!newsArticles || newsArticles.length === 0) return;
  
  // Get first 3 article images (most likely to be viewed)
  const criticalImages = newsArticles
    .slice(0, 3)
    .map(article => {
      const imgUrl = article.featured_image || article.image;
      if (!imgUrl) return null;
      
      return imgUrl.startsWith('/') 
        ? `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}${imgUrl}`
        : imgUrl;
    })
    .filter(Boolean);
  
  // Preload in background without blocking UI
  setTimeout(() => {
    preloadImages(criticalImages);
  }, 1000); // Start preloading 1 second after page load
};