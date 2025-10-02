import React, { useState, useEffect, useCallback } from 'react';
import { 
  Edit, Save, X, Upload, Settings, Palette, Link as LinkIcon, 
  Eye, EyeOff, Plus, Trash2, Menu, Image as ImageIcon, Video,
  ExternalLink, Hash, Camera, Type, MousePointer
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLiveEditor } from '../contexts/LiveEditorContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

export const AdvancedLiveEditor = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const {
    isEditing,
    setIsEditing,
    saveContent,
    uploadMedia,
    toggleSectionVisibility,
    isSectionHidden,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    partners,
    addPartner,
    updatePartner,
    deletePartner,
    faqItems,
    updateFaqItem
  } = useLiveEditor();

  const [editModal, setEditModal] = useState({ show: false, type: '', data: {} });
  const [managementPanel, setManagementPanel] = useState({ show: false, type: '' });

  // useCallback handlers to prevent focus issues
  const handleTextValueChange = useCallback((e) => {
    setEditModal(prev => ({
      ...prev,
      data: { ...prev.data, currentValue: e.target.value }
    }));
  }, []);

  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  // Handle text content editing
  const handleEditText = (element) => {
    const elementId = element.getAttribute('data-edit-id');
    const currentValue = element.textContent || element.value || '';
    
    setEditModal({
      show: true,
      type: 'text',
      data: {
        elementId,
        element,
        currentValue
      }
    });
  };

  // Handle image/video editing
  const handleEditMedia = (element) => {
    const elementId = element.getAttribute('data-edit-id');
    let currentSrc = '';
    
    if (element.tagName === 'IMG') {
      currentSrc = element.src;
    } else if (element.tagName === 'VIDEO') {
      currentSrc = element.src || element.querySelector('source')?.src || '';
    } else if (element.style.backgroundImage) {
      const match = element.style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
      currentSrc = match ? match[1] : '';
    }
    
    setEditModal({
      show: true,
      type: 'media',
      data: {
        elementId,
        element,
        currentSrc,
        mediaType: element.tagName.toLowerCase()
      }
    });
  };

  // Handle section color change
  const handleColorChange = (section, color) => {
    section.style.backgroundColor = color;
    const sectionId = section.getAttribute('data-section-id');
    if (sectionId) {
      saveContent(`${sectionId}_color`, color);
    }
  };

  // Handle section visibility toggle
  const handleToggleSection = (sectionId) => {
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (section) {
      const isHidden = isSectionHidden(sectionId);
      section.style.display = isHidden ? 'block' : 'none';
      toggleSectionVisibility(sectionId);
    }
  };

  // Save text edit
  const saveTextEdit = async () => {
    const { elementId, element } = editModal.data;
    const newValue = document.getElementById('edit-text-input').value;
    
    element.textContent = newValue;
    await saveContent(elementId, newValue);
    setEditModal({ show: false, type: '', data: {} });
  };

  // Save media edit
  const saveMediaEdit = async (newMediaUrl) => {
    const { elementId, element, mediaType } = editModal.data;
    
    if (mediaType === 'img') {
      element.src = newMediaUrl;
    } else if (mediaType === 'video') {
      element.src = newMediaUrl;
      const source = element.querySelector('source');
      if (source) source.src = newMediaUrl;
    } else {
      element.style.backgroundImage = `url(${newMediaUrl})`;
    }
    
    await saveContent(elementId, newMediaUrl);
    setEditModal({ show: false, type: '', data: {} });
  };

  // File upload handler
  const handleFileUpload = async (file) => {
    const mediaUrl = await uploadMedia(file);
    if (mediaUrl) {
      await saveMediaEdit(mediaUrl);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      // Cleanup all overlays
      document.querySelectorAll('.live-edit-overlay, .live-edit-floating-btn').forEach(el => el.remove());
      document.querySelectorAll('[data-edit-id]').forEach(element => {
        element.style.outline = '';
        element.style.cursor = '';
      });
      return;
    }

    // Add floating edit buttons that don't affect layout
    const editableElements = document.querySelectorAll('[data-edit-id]');
    editableElements.forEach(element => {
      // Only add outline, no positioning changes
      element.style.outline = '2px dashed #3B82F6';
      element.style.cursor = 'pointer';

      // Create floating button container that doesn't affect layout
      const floatingBtn = document.createElement('div');
      floatingBtn.className = 'live-edit-floating-btn';
      floatingBtn.style.cssText = `
        position: fixed;
        background: rgba(59, 130, 246, 0.95);
        backdrop-filter: blur(4px);
        border-radius: 8px;
        padding: 4px;
        z-index: 10000;
        display: none;
        gap: 2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        pointer-events: auto;
      `;

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.innerHTML = `<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
      editBtn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      editBtn.onmouseenter = () => editBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
      editBtn.onmouseleave = () => editBtn.style.backgroundColor = 'transparent';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        if (element.tagName === 'IMG' || element.tagName === 'VIDEO' || 
            element.style.backgroundImage || element.querySelector('img') || element.querySelector('video')) {
          handleEditMedia(element);
        } else {
          handleEditText(element);
        }
        floatingBtn.style.display = 'none';
      };

      floatingBtn.appendChild(editBtn);

      // Media upload button for images/videos
      if (element.tagName === 'IMG' || element.tagName === 'VIDEO' || 
          element.querySelector('img') || element.querySelector('video') ||
          element.style.backgroundImage) {
        const uploadBtn = document.createElement('button');
        uploadBtn.innerHTML = `<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`;
        uploadBtn.style.cssText = editBtn.style.cssText;
        uploadBtn.onmouseenter = () => uploadBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
        uploadBtn.onmouseleave = () => uploadBtn.style.backgroundColor = 'transparent';
        uploadBtn.onclick = (e) => {
          e.stopPropagation();
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*,video/*';
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) handleFileUpload(file);
          };
          input.click();
          floatingBtn.style.display = 'none';
        };
        floatingBtn.appendChild(uploadBtn);
      }

      // Show floating button on hover with better positioning
      element.onmouseenter = (e) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Calculate optimal position
        let left = rect.right - 80;
        let top = Math.max(10, rect.top - 40); // Ensure minimum 10px from top
        
        // Keep button within viewport
        if (left + 80 > viewportWidth) {
          left = rect.left - 80;
        }
        if (left < 10) {
          left = 10;
        }
        
        // Ensure button doesn't go above viewport
        if (top < 10) {
          top = rect.bottom + 10;
        }
        
        // Ensure button doesn't go below viewport
        if (top + 40 > viewportHeight) {
          top = viewportHeight - 50;
        }
        
        floatingBtn.style.display = 'flex';
        floatingBtn.style.left = `${left}px`;
        floatingBtn.style.top = `${top}px`;
      };

      element.onmouseleave = (e) => {
        // Only hide if not hovering over the floating button
        setTimeout(() => {
          if (!floatingBtn.matches(':hover') && !element.matches(':hover')) {
            floatingBtn.style.display = 'none';
          }
        }, 100);
      };

      floatingBtn.onmouseleave = () => {
        floatingBtn.style.display = 'none';
      };

      document.body.appendChild(floatingBtn);
    });

    // Add section controls with professional icons
    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section-id');
      const sectionOverlay = document.createElement('div');
      sectionOverlay.className = 'live-edit-overlay';
      sectionOverlay.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 9999;
        display: flex;
        gap: 4px;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(4px);
        border-radius: 8px;
        padding: 4px;
      `;

      // Color picker button
      const colorBtn = document.createElement('button');
      colorBtn.innerHTML = `<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c0.83,0,1.5-0.67,1.5-1.5c0-0.39-0.15-0.74-0.39-1.01c-0.23-0.26-0.38-0.61-0.38-0.99c0-0.83,0.67-1.5,1.5-1.5H16c2.76,0,5-2.24,5-5C21,6.58,17.97,3,12,3z M6.5,12c-0.83,0-1.5-0.67-1.5-1.5S5.67,9,6.5,9S8,9.67,8,10.5S7.33,12,6.5,12z M9.5,8C8.67,8,8,7.33,8,6.5S8.67,5,9.5,5s1.5,0.67,1.5,1.5S10.33,8,9.5,8z M14.5,8c-0.83,0-1.5-0.67-1.5-1.5S13.67,5,14.5,5S16,5.67,16,6.5S15.33,8,14.5,8z M17.5,12c-0.83,0-1.5-0.67-1.5-1.5S16.67,9,17.5,9S19,9.67,19,10.5S18.33,12,17.5,12z"/></svg>`;
      colorBtn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      colorBtn.onmouseenter = () => colorBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
      colorBtn.onmouseleave = () => colorBtn.style.backgroundColor = 'transparent';
      colorBtn.onclick = (e) => {
        e.stopPropagation();
        setManagementPanel({ show: true, type: 'color', data: { section } });
      };

      // Visibility toggle button
      const isHidden = isSectionHidden(sectionId);
      const visibilityBtn = document.createElement('button');
      visibilityBtn.innerHTML = isHidden 
        ? `<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/></svg>`
        : `<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"/></svg>`;
      
      visibilityBtn.style.cssText = colorBtn.style.cssText;
      visibilityBtn.onmouseenter = () => visibilityBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
      visibilityBtn.onmouseleave = () => visibilityBtn.style.backgroundColor = 'transparent';
      visibilityBtn.onclick = (e) => {
        e.stopPropagation();
        handleToggleSection(sectionId);
      };

      sectionOverlay.appendChild(colorBtn);
      sectionOverlay.appendChild(visibilityBtn);
      
      section.style.position = 'relative';
      section.appendChild(sectionOverlay);
    });

    return () => {
      // Cleanup
      document.querySelectorAll('.live-edit-overlay, .live-edit-floating-btn').forEach(el => el.remove());
    };
  }, [isEditing, isSectionHidden]);

  return (
    <>
      {/* Main Toggle Button */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={`${isEditing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg`}
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Stop Bewerken
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Live Bewerken
            </>
          )}
        </Button>

        {isEditing && (
          <>
            <Button
              onClick={() => setManagementPanel({ show: true, type: 'menu' })}
              className="bg-green-600 hover:bg-green-700 text-white text-sm shadow-lg"
              title="Menu Beheer"
            >
              <Menu className="h-4 w-4 mr-1" />
              Menu
            </Button>
            <Button
              onClick={() => setManagementPanel({ show: true, type: 'partners' })}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm shadow-lg"
              title="Partners Beheer"
            >
              <Plus className="h-4 w-4 mr-1" />
              Partners
            </Button>
            <Button
              onClick={() => setManagementPanel({ show: true, type: 'faq' })}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm shadow-lg"
              title="FAQ Beheer"
            >
              <Settings className="h-4 w-4 mr-1" />
              FAQ
            </Button>
          </>
        )}
      </div>

      {/* Text Edit Modal */}
      {editModal.show && editModal.type === 'text' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw] shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Type className="h-5 w-5 mr-2 text-blue-600" />
              Tekst Bewerken
            </h3>
            
            {editModal.data.currentValue.length > 50 ? (
              <Textarea
                id="edit-text-input"
                defaultValue={editModal.data.currentValue}
                rows={4}
                className="w-full mb-4"
                placeholder="Voer uw tekst in..."
              />
            ) : (
              <Input
                id="edit-text-input"
                defaultValue={editModal.data.currentValue}
                className="w-full mb-4"
                placeholder="Voer uw tekst in..."
              />
            )}
            
            <div className="flex space-x-2">
              <Button onClick={saveTextEdit} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                <Save className="h-4 w-4 mr-2" />
                Opslaan
              </Button>
              <Button onClick={() => setEditModal({ show: false, type: '', data: {} })} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Annuleren
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Edit Modal */}
      {editModal.show && editModal.type === 'media' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw] shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-purple-600" />
              Media Bewerken
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload nieuw bestand:</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileUpload(file);
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Of voer URL in:</label>
              <Input
                id="media-url-input"
                defaultValue={editModal.data.currentSrc}
                className="w-full mb-2"
                placeholder="https://example.com/image.jpg"
              />
              <Button 
                onClick={() => {
                  const url = document.getElementById('media-url-input').value;
                  if (url) saveMediaEdit(url);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                URL Gebruiken
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={() => setEditModal({ show: false, type: '', data: {} })} variant="outline" className="w-full">
                <X className="h-4 w-4 mr-2" />
                Annuleren
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Management Panels */}
      {managementPanel.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto shadow-2xl">
            {managementPanel.type === 'color' && (
              <>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-amber-600" />
                  Sectie Kleur Wijzigen
                </h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {['#B91C1C', '#DC2626', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FEF3C7', '#FFF5F5', '#FEF7ED', '#F0FDF4'].map(color => (
                    <button
                      key={color}
                      className="w-16 h-16 rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:scale-105 transition-all shadow-sm"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        handleColorChange(managementPanel.data.section, color);
                        setManagementPanel({ show: false, type: '' });
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  defaultValue="#B91C1C"
                  onChange={(e) => {
                    handleColorChange(managementPanel.data.section, e.target.value);
                    setManagementPanel({ show: false, type: '' });
                  }}
                  className="w-full h-12"
                />
              </>
            )}

            {managementPanel.type === 'menu' && (
              <>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Menu className="h-5 w-5 mr-2 text-green-600" />
                  Menu Beheer
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Huidige Menu Items:</h4>
                    {/* Show current header menu items */}
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-600">Bestel je tickets → FlexTickets (externe link)</div>
                      <div className="text-sm text-gray-600">Veelgestelde vragen → #faq (interne sectie)</div>
                      <div className="text-sm text-gray-600">Nieuws → #news (interne sectie)</div>
                    </div>
                  </div>
                  
                  {menuItems.map((item, index) => (
                    <div key={item.id || index} className="border p-4 rounded-lg bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          defaultValue={item.name}
                          placeholder="Menu tekst"
                          onBlur={(e) => updateMenuItem(item.id, { name: e.target.value })}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => deleteMenuItem(item.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue={item.type}
                          onChange={(e) => updateMenuItem(item.id, { type: e.target.value })}
                          className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="scroll">Interne Sectie</option>
                          <option value="external">Externe Link</option>
                        </select>
                        <Input
                          defaultValue={item.href}
                          placeholder={item.type === 'scroll' ? '#sectie-naam' : 'https://...'}
                          onBlur={(e) => updateMenuItem(item.id, { href: e.target.value })}
                          className="flex-1"
                        />
                        {item.type === 'scroll' && <Hash className="h-4 w-4 text-blue-500" />}
                        {item.type === 'external' && <ExternalLink className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => addMenuItem('Nieuw Item', '#', 'scroll')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Menu Item Toevoegen
                  </Button>
                </div>
              </>
            )}

            {managementPanel.type === 'partners' && (
              <>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-purple-600" />
                  Partners Beheer
                </h3>
                <div className="space-y-4">
                  {partners.map((partner) => (
                    <div key={partner.id} className="border p-4 rounded-lg bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          defaultValue={partner.name}
                          placeholder="Partner naam"
                          onBlur={(e) => updatePartner(partner.id, { name: e.target.value })}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => deletePartner(partner.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        defaultValue={partner.imageUrl}
                        placeholder="Afbeelding URL"
                        onBlur={(e) => updatePartner(partner.id, { imageUrl: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        defaultValue={partner.website}
                        placeholder="Website (optioneel)"
                        onBlur={(e) => updatePartner(partner.id, { website: e.target.value })}
                      />
                    </div>
                  ))}
                  <Button
                    onClick={() => addPartner('Nieuwe Partner', '', '')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Partner Toevoegen
                  </Button>
                </div>
              </>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button onClick={() => setManagementPanel({ show: false, type: '' })} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Sluiten
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg z-40 max-w-sm shadow-xl">
          <h4 className="font-semibold mb-2 flex items-center">
            <MousePointer className="h-4 w-4 mr-2" />
            Live Editor Actief
          </h4>
          <ul className="text-sm space-y-1 opacity-90">
            <li>• Hover over elementen om te bewerken</li>
            <li>• Gebruik knoppen rechts voor beheer</li>
            <li>• Wijzigingen worden automatisch opgeslagen</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default AdvancedLiveEditor;