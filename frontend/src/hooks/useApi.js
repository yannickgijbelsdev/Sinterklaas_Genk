import { useState, useEffect } from 'react';

const API = 'http://localhost:8001/api';

export const useApi = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}${endpoint}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

export const useNews = () => {
  return useApi('/admin/news');
};

export const useShows = () => {
  return useApi('/admin/shows');
};

export const useContent = () => {
  return useApi('/admin/content');
};

// Helper function to get content value by section and key
export const getContentValue = (contentArray, section, key, fallback = '') => {
  if (!contentArray) return fallback;
  
  const item = contentArray.find(item => 
    item.section === section && item.key === key
  );
  
  return item ? item.value : fallback;
};

export const useGallery = () => {
  return useApi('/admin/gallery');
};