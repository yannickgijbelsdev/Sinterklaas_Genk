import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const LiveEditorContext = createContext();

export const useLiveEditor = () => {
  const context = useContext(LiveEditorContext);
  if (!context) {
    throw new Error('useLiveEditor must be used within a LiveEditorProvider');
  }
  return context;
};

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

export const LiveEditorProvider = ({ children }) => {
  const { isAuthenticated, isAdmin, apiCall } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [pageContent, setPageContent] = useState({});
  const [hiddenSections, setHiddenSections] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [partners, setPartners] = useState([]);
  const [faqItems, setFaqItems] = useState([]);

  // Load all content on mount and apply to page elements
  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      loadAllContent().then(() => {
        // Apply loaded content to page elements
        applyStoredContentToPage();
      });
    }
  }, [isAuthenticated, isAdmin]);

  // Apply stored content to page elements
  const applyStoredContentToPage = () => {
    Object.keys(pageContent).forEach(contentId => {
      const element = document.querySelector(`[data-edit-id="${contentId}"]`);
      if (element && pageContent[contentId]) {
        const value = pageContent[contentId];
        
        if (element.tagName === 'IMG') {
          element.src = value;
        } else if (element.tagName === 'VIDEO') {
          element.src = value;
          const source = element.querySelector('source');
          if (source) source.src = value;
        } else if (element.style.backgroundImage !== undefined) {
          element.style.backgroundImage = `url(${value})`;
        } else {
          element.textContent = value;
        }
      }
    });

    // Apply section colors
    Object.keys(pageContent).forEach(key => {
      if (key.endsWith('_color')) {
        const sectionId = key.replace('_color', '');
        const section = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (section) {
          section.style.backgroundColor = pageContent[key];
        }
      }
    });

    // Apply hidden sections
    hiddenSections.forEach(sectionId => {
      const section = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (section) {
        section.style.display = 'none';
      }
    });
  };

  // Only load content if user is authenticated and admin
  if (!isAuthenticated() || !isAdmin()) {
    // Return a minimal version for non-admin users
    const value = {
      isEditing: false,
      pageContent: {},
      hiddenSections: [],
      menuItems: [],
      partners: [],
      faqItems: [],
      setIsEditing: () => {},
      loadAllContent: () => {},
      saveContent: () => {},
      saveConfiguration: () => {},
      uploadMedia: () => {},
      toggleSectionVisibility: () => {},
      addMenuItem: () => {},
      updateMenuItem: () => {},
      deleteMenuItem: () => {},
      addPartner: () => {},
      updatePartner: () => {},
      deletePartner: () => {},
      updateFaqItem: () => {},
      getContent: (contentId, defaultValue = '') => defaultValue,
      isSectionHidden: () => false
    };
    
    return (
      <LiveEditorContext.Provider value={value}>
        {children}
      </LiveEditorContext.Provider>
    );
  }

  const loadAllContent = async () => {
    try {
      // Load general content
      const contentRes = await apiCall('/admin/content');
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        const contentObj = {};
        contentData.forEach(item => {
          contentObj[item.id] = item.value;
        });
        setPageContent(contentObj);
      }

      // Load configuration data (menu, partners, etc.)
      const configRes = await apiCall('/admin/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setMenuItems(configData.menuItems || []);
        setPartners(configData.partners || []);
        setFaqItems(configData.faqItems || []);
        setHiddenSections(configData.hiddenSections || []);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const saveContent = async (contentId, value) => {
    try {
      await apiCall('/admin/content', {
        method: 'PUT',
        body: JSON.stringify({
          id: contentId,
          value: value
        })
      });
      
      setPageContent(prev => ({
        ...prev,
        [contentId]: value
      }));
      
      toast.success('Content opgeslagen!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Fout bij opslaan');
    }
  };

  const saveConfiguration = async (configType, data) => {
    try {
      await apiCall('/admin/config', {
        method: 'PUT',
        body: JSON.stringify({
          type: configType,
          data: data
        })
      });
      
      switch (configType) {
        case 'menuItems':
          setMenuItems(data);
          break;
        case 'partners':
          setPartners(data);
          break;
        case 'faqItems':
          setFaqItems(data);
          break;
        case 'hiddenSections':
          setHiddenSections(data);
          break;
      }
      
      toast.success('Configuratie opgeslagen!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Fout bij opslaan configuratie');
    }
  };

  const uploadMedia = async (file, type = 'general') => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    try {
      const response = await apiCall('/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const mediaUrl = `${process.env.REACT_APP_BACKEND_URL}${result.url}`;
        toast.success('Media geüpload!');
        return mediaUrl;
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Fout bij uploaden');
    }
    return null;
  };

  const toggleSectionVisibility = async (sectionId) => {
    const newHiddenSections = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    
    await saveConfiguration('hiddenSections', newHiddenSections);
  };

  const addMenuItem = async (name, href, type = 'scroll') => {
    const newMenuItem = {
      id: Date.now().toString(),
      name,
      href,
      type // 'scroll' for internal sections, 'external' for external links
    };
    
    const newMenuItems = [...menuItems, newMenuItem];
    await saveConfiguration('menuItems', newMenuItems);
  };

  const updateMenuItem = async (id, updates) => {
    const newMenuItems = menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    await saveConfiguration('menuItems', newMenuItems);
  };

  const deleteMenuItem = async (id) => {
    const newMenuItems = menuItems.filter(item => item.id !== id);
    await saveConfiguration('menuItems', newMenuItems);
  };

  const addPartner = async (name, imageUrl, website = '') => {
    const newPartner = {
      id: Date.now().toString(),
      name,
      imageUrl,
      website
    };
    
    const newPartners = [...partners, newPartner];
    await saveConfiguration('partners', newPartners);
  };

  const updatePartner = async (id, updates) => {
    const newPartners = partners.map(partner => 
      partner.id === id ? { ...partner, ...updates } : partner
    );
    await saveConfiguration('partners', newPartners);
  };

  const deletePartner = async (id) => {
    const newPartners = partners.filter(partner => partner.id !== id);
    await saveConfiguration('partners', newPartners);
  };

  const updateFaqItem = async (index, question, answer) => {
    const newFaqItems = [...faqItems];
    newFaqItems[index] = { question, answer };
    await saveConfiguration('faqItems', newFaqItems);
  };

  const value = {
    // State
    isEditing,
    pageContent,
    hiddenSections,
    menuItems,
    partners,
    faqItems,
    
    // Actions
    setIsEditing,
    loadAllContent,
    saveContent,
    saveConfiguration,
    uploadMedia,
    toggleSectionVisibility,
    
    // Menu management
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    
    // Partner management
    addPartner,
    updatePartner,
    deletePartner,
    
    // FAQ management
    updateFaqItem,
    
    // Utility
    getContent: (contentId, defaultValue = '') => pageContent[contentId] || defaultValue,
    isSectionHidden: (sectionId) => hiddenSections.includes(sectionId)
  };

  return (
    <LiveEditorContext.Provider value={value}>
      {children}
    </LiveEditorContext.Provider>
  );
};