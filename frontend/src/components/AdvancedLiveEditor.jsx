import React, { useState, useEffect } from 'react';
import { 
  Edit, Save, X, Upload, Settings, Palette, Link as LinkIcon, 
  Eye, EyeOff, Plus, Trash2, Menu, Image as ImageIcon, Video,
  ExternalLink, Hash
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
    const currentSrc = element.src || element.style.backgroundImage?.match(/url\("(.+)"\)/)?.[1] || '';
    
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
    const { elementId, element, currentValue } = editModal.data;
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
      // Cleanup
      document.querySelectorAll('.live-edit-overlay').forEach(el => el.remove());
      document.querySelectorAll('[data-edit-id]').forEach(element => {
        element.style.outline = '';
        element.style.cursor = '';
      });
      return;
    }

    // Add editing overlays
    const editableElements = document.querySelectorAll('[data-edit-id]');
    editableElements.forEach(element => {
      element.style.outline = '2px dashed #3B82F6';
      element.style.cursor = 'pointer';
      element.style.position = 'relative';

      // Create overlay with buttons
      const overlay = document.createElement('div');
      overlay.className = 'live-edit-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: -2px;
        right: -2px;
        z-index: 1000;
        display: flex;
        gap: 2px;
      `;

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.innerHTML = '✏️';
      editBtn.style.cssText = `
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 4px;
        width: 24px;
        height: 24px;
        font-size: 12px;
        cursor: pointer;
      `;
      editBtn.onclick = (e) => {
        e.stopPropagation();
        if (element.tagName === 'IMG' || element.tagName === 'VIDEO' || 
            element.style.backgroundImage) {
          handleEditMedia(element);
        } else {
          handleEditText(element);
        }
      };

      overlay.appendChild(editBtn);

      // Media upload button for images/videos
      if (element.tagName === 'IMG' || element.tagName === 'VIDEO' || 
          element.querySelector('img') || element.querySelector('video')) {
        const uploadBtn = document.createElement('button');
        uploadBtn.innerHTML = '📷';
        uploadBtn.style.cssText = `
          background: #10B981;
          color: white;
          border: none;
          border-radius: 4px;
          width: 24px;
          height: 24px;
          font-size: 12px;
          cursor: pointer;
        `;
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
        };
        overlay.appendChild(uploadBtn);
      }

      element.appendChild(overlay);
    });

    // Add section controls
    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section-id');
      const sectionOverlay = document.createElement('div');
      sectionOverlay.className = 'live-edit-overlay';
      sectionOverlay.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
        display: flex;
        gap: 4px;
      `;

      // Color picker button
      const colorBtn = document.createElement('button');
      colorBtn.innerHTML = '🎨';
      colorBtn.style.cssText = `
        background: #F59E0B;
        color: white;
        border: none;
        border-radius: 4px;
        width: 32px;
        height: 32px;
        font-size: 16px;
        cursor: pointer;
      `;
      colorBtn.onclick = (e) => {
        e.stopPropagation();
        setManagementPanel({ show: true, type: 'color', data: { section } });
      };

      // Visibility toggle button
      const visibilityBtn = document.createElement('button');
      visibilityBtn.innerHTML = isSectionHidden(sectionId) ? '👁️' : '🙈';
      visibilityBtn.style.cssText = `
        background: ${isSectionHidden(sectionId) ? '#10B981' : '#EF4444'};
        color: white;
        border: none;
        border-radius: 4px;
        width: 32px;
        height: 32px;
        font-size: 16px;
        cursor: pointer;
      `;
      visibilityBtn.onclick = (e) => {
        e.stopPropagation();
        handleToggleSection(sectionId);
        // Update button appearance
        setTimeout(() => {
          visibilityBtn.innerHTML = isSectionHidden(sectionId) ? '🙈' : '👁️';
          visibilityBtn.style.background = isSectionHidden(sectionId) ? '#EF4444' : '#10B981';
        }, 100);
      };

      sectionOverlay.appendChild(colorBtn);
      sectionOverlay.appendChild(visibilityBtn);
      section.style.position = 'relative';
      section.appendChild(sectionOverlay);
    });

    return () => {
      // Cleanup
      document.querySelectorAll('.live-edit-overlay').forEach(el => el.remove());
    };
  }, [isEditing, isSectionHidden]);

  return (
    <>
      {/* Main Toggle Button */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={`${isEditing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
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
              className="bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              <Menu className="h-4 w-4 mr-1" />
              Menu
            </Button>
            <Button
              onClick={() => setManagementPanel({ show: true, type: 'partners' })}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Partners
            </Button>
            <Button
              onClick={() => setManagementPanel({ show: true, type: 'faq' })}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
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
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Tekst Bewerken</h3>
            
            {editModal.data.currentValue.length > 50 ? (
              <Textarea
                id="edit-text-input"
                defaultValue={editModal.data.currentValue}
                rows={4}
                className="w-full mb-4"
              />
            ) : (
              <Input
                id="edit-text-input"
                defaultValue={editModal.data.currentValue}
                className="w-full mb-4"
              />
            )}
            
            <div className="flex space-x-2">
              <Button onClick={saveTextEdit} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Opslaan
              </Button>
              <Button onClick={() => setEditModal({ show: false, type: '', data: {} })} variant="outline">
                Annuleren
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Edit Modal */}
      {editModal.show && editModal.type === 'media' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Media Bewerken</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload nieuw bestand:</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileUpload(file);
                }}
                className="w-full p-2 border rounded"
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
                URL Gebruiken
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={() => setEditModal({ show: false, type: '', data: {} })} variant="outline" className="w-full">
                Annuleren
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Management Panels */}
      {managementPanel.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            {managementPanel.type === 'color' && (
              <>
                <h3 className="text-lg font-semibold mb-4">Sectie Kleur</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {['#B91C1C', '#DC2626', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FEF3C7', '#FFF5F5', '#FEF7ED', '#F0FDF4'].map(color => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded border-2 border-gray-200 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        handleColorChange(managementPanel.data.section, color);
                        setManagementPanel({ show: false, type: '' });
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {managementPanel.type === 'menu' && (
              <>
                <h3 className="text-lg font-semibold mb-4">Menu Beheer</h3>
                <div className="space-y-4">
                  {menuItems.map((item, index) => (
                    <div key={item.id} className="border p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          defaultValue={item.name}
                          placeholder="Menu tekst"
                          onBlur={(e) => updateMenuItem(item.id, { name: e.target.value })}
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
                          className="border rounded px-2 py-1"
                        >
                          <option value="scroll">Sectie</option>
                          <option value="external">Externe Link</option>
                        </select>
                        <Input
                          defaultValue={item.href}
                          placeholder={item.type === 'scroll' ? '#sectie' : 'https://...'}
                          onBlur={(e) => updateMenuItem(item.id, { href: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => addMenuItem('Nieuw Item', '#', 'scroll')}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Menu Item Toevoegen
                  </Button>
                </div>
              </>
            )}

            {managementPanel.type === 'partners' && (
              <>
                <h3 className="text-lg font-semibold mb-4">Partners Beheer</h3>
                <div className="space-y-4">
                  {partners.map((partner) => (
                    <div key={partner.id} className="border p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          defaultValue={partner.name}
                          placeholder="Partner naam"
                          onBlur={(e) => updatePartner(partner.id, { name: e.target.value })}
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
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Partner Toevoegen
                  </Button>
                </div>
              </>
            )}

            <div className="flex justify-end mt-4">
              <Button onClick={() => setManagementPanel({ show: false, type: '' })} variant="outline">
                Sluiten
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-lg z-40 max-w-sm">
          <h4 className="font-semibold mb-2">Live Editor</h4>
          <ul className="text-sm space-y-1">
            <li>✏️ Klik elementen om te bewerken</li>
            <li>🎨 Sectie kleuren wijzigen</li>
            <li>👁️ Secties verbergen/tonen</li>
            <li>📷 Media uploaden</li>
            <li>⚙️ Menu/Partners/FAQ beheren</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default AdvancedLiveEditor;