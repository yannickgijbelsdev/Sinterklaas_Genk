import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useApi = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
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

export const useGallery = () => {
  return useApi('/admin/gallery');
};