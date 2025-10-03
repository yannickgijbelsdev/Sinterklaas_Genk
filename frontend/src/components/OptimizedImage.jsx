import React, { useState, useRef, useEffect } from 'react';
import { globalImageLoader, getValidImageUrl } from '../utils/imageLoader';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  fallbackSrc = null,
  maxRetries = 3,
  retryDelay = 1000,
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef(null);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.warn(`Image failed to load: ${currentSrc}`);
    
    // Try retry mechanism first
    if (retryCount < maxRetries) {
      console.log(`Retrying image load (attempt ${retryCount + 1}/${maxRetries}): ${currentSrc}`);
      
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        // Force reload by changing src slightly
        const timestamp = Date.now();
        const separator = currentSrc.includes('?') ? '&' : '?';
        setCurrentSrc(`${src}${separator}retry=${timestamp}`);
      }, retryDelay);
      
      return;
    }

    // If all retries failed, try fallback
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      console.log(`Using fallback image: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setRetryCount(0); // Reset retry count for fallback
      return;
    }

    // Final fallback - show error state
    setIsLoading(false);
    setHasError(true);
  };

  // Loading placeholder
  if (isLoading && !hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
        style={style}
        {...props}
      >
        <div className="text-gray-400 text-sm">Laden...</div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
        style={style}
        {...props}
      >
        <div className="text-center text-gray-500 p-4">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-xs">Afbeelding niet beschikbaar</div>
        </div>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default OptimizedImage;