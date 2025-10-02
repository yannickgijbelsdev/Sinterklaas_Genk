import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Upload, Settings, Palette, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

export const LiveEditor = ({ isEnabled, onToggle }) => {
  const { isAuthenticated, isAdmin, apiCall } = useAuth();
  const [editingElement, setEditingElement] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#B91C1C');
  const [showImageUpload, setShowImageUpload] = useState(false);

  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  const handleEditElement = (element, type = 'text') => {
    const currentValue = element.textContent || element.value || '';
    setEditValue(currentValue);
    setEditingElement({ element, type });
  };

  const handleSaveEdit = async () => {
    if (!editingElement) return;

    const { element, type } = editingElement;
    
    if (type === 'text') {
      element.textContent = editValue;
    } else if (type === 'input') {
      element.value = editValue;
    }

    // Save to backend (content management system)
    try {
      const elementId = element.getAttribute('data-edit-id');
      if (elementId) {
        await apiCall('/admin/content', {
          method: 'PUT',
          body: JSON.stringify({
            id: elementId,
            value: editValue
          })
        });
        toast.success('Content opgeslagen!');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Fout bij opslaan');
    }

    setEditingElement(null);
    setEditValue('');
  };

  const handleColorChange = (element, color) => {
    element.style.backgroundColor = color;
    // Save color change to backend
    const sectionId = element.getAttribute('data-section-id');
    if (sectionId) {
      apiCall('/admin/content', {
        method: 'PUT',
        body: JSON.stringify({
          id: `${sectionId}_color`,
          value: color
        })
      }).then(() => {
        toast.success('Kleur opgeslagen!');
      }).catch(() => {
        toast.error('Fout bij opslaan kleur');
      });
    }
  };

  const handleImageUpload = async (element, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiCall('/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = `${process.env.REACT_APP_BACKEND_URL}${result.url}`;
        
        if (element.tagName === 'IMG') {
          element.src = imageUrl;
        } else if (element.tagName === 'VIDEO') {
          element.src = imageUrl;
          element.querySelector('source').src = imageUrl;
        } else {
          element.style.backgroundImage = `url(${imageUrl})`;
        }

        // Save to backend
        const elementId = element.getAttribute('data-edit-id');
        if (elementId) {
          await apiCall('/admin/content', {
            method: 'PUT',
            body: JSON.stringify({
              id: elementId,
              value: imageUrl
            })
          });
        }
        toast.success('Afbeelding geüpload!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Fout bij uploaden');
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      // Cleanup
      document.querySelectorAll('.live-edit-btn').forEach(btn => btn.remove());
      document.querySelectorAll('.color-picker-btn').forEach(btn => btn.remove());
      document.querySelectorAll('.image-upload-btn').forEach(btn => btn.remove());
      document.querySelectorAll('[data-edit-id]').forEach(element => {
        element.style.outline = '';
        element.style.cursor = '';
      });
      return;
    }

    // Add edit indicators to editable elements
    const editableElements = document.querySelectorAll('[data-edit-id]');
    editableElements.forEach(element => {
      element.style.outline = '2px dashed #3B82F6';
      element.style.position = 'relative';
      element.style.cursor = 'pointer';

      const editButton = document.createElement('button');
      editButton.innerHTML = '✏️';
      editButton.className = 'live-edit-btn';
      editButton.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: 12px;
        cursor: pointer;
        z-index: 1000;
      `;

      editButton.onclick = (e) => {
        e.stopPropagation();
        handleEditElement(element);
      };

      element.appendChild(editButton);

      // Add image upload button for images and videos
      if (element.tagName === 'IMG' || element.tagName === 'VIDEO' || element.querySelector('img') || element.querySelector('video')) {
        const uploadButton = document.createElement('button');
        uploadButton.innerHTML = '📷';
        uploadButton.className = 'image-upload-btn';
        uploadButton.style.cssText = `
          position: absolute;
          top: -10px;
          left: -10px;
          background: #10B981;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 12px;
          cursor: pointer;
          z-index: 1000;
        `;

        uploadButton.onclick = (e) => {
          e.stopPropagation();
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*,video/*';
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              handleImageUpload(element, file);
            }
          };
          input.click();
        };

        element.appendChild(uploadButton);
      }
    });

    // Add color picker buttons to sections
    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach(section => {
      const colorButton = document.createElement('button');
      colorButton.innerHTML = '🎨';
      colorButton.className = 'color-picker-btn';
      colorButton.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: #F59E0B;
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        font-size: 16px;
        cursor: pointer;
        z-index: 1000;
      `;

      colorButton.onclick = (e) => {
        e.stopPropagation();
        setShowColorPicker(section);
      };

      section.style.position = 'relative';
      section.appendChild(colorButton);
    });

    return () => {
      // Cleanup on disable or unmount
      document.querySelectorAll('.live-edit-btn').forEach(btn => btn.remove());
      document.querySelectorAll('.color-picker-btn').forEach(btn => btn.remove());
      document.querySelectorAll('.image-upload-btn').forEach(btn => btn.remove());
      editableElements.forEach(element => {
        element.style.outline = '';
        element.style.cursor = '';
      });
    };
  }, [isEnabled]);

  return (
    <>
      {/* Edit Toggle Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={onToggle}
          className={`${isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          {isEnabled ? (
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
      </div>

      {/* Edit Modal */}
      {editingElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Content Bewerken</h3>
            
            {editingElement.element.tagName === 'H1' || 
             editingElement.element.tagName === 'H2' || 
             editingElement.element.tagName === 'H3' ||
             editingElement.element.tagName === 'P' ||
             editingElement.element.textContent.length > 50 ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={4}
                className="w-full mb-4"
                placeholder="Voer uw tekst in..."
              />
            ) : (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full mb-4"
                placeholder="Voer uw tekst in..."
              />
            )}
            
            <div className="flex space-x-2">
              <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Opslaan
              </Button>
              <Button 
                onClick={() => setEditingElement(null)} 
                variant="outline"
              >
                Annuleren
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Sectie Kleur Wijzigen</h3>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {['#B91C1C', '#DC2626', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FEF3C7', '#FFF5F5', '#FEF7ED', '#F0FDF4'].map(color => (
                <button
                  key={color}
                  className="w-12 h-12 rounded border-2 border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleColorChange(showColorPicker, color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
            
            <Input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full mb-4"
            />
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  handleColorChange(showColorPicker, selectedColor);
                  setShowColorPicker(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Palette className="h-4 w-4 mr-2" />
                Toepassen
              </Button>
              <Button 
                onClick={() => setShowColorPicker(false)} 
                variant="outline"
              >
                Annuleren
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Panel */}
      {isEnabled && (
        <div className="fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-lg z-40 max-w-sm">
          <h4 className="font-semibold mb-2">Live Editor Instructies</h4>
          <ul className="text-sm space-y-1">
            <li>✏️ Klik op blauwe rand om tekst te bewerken</li>
            <li>🎨 Klik op gele knop om sectie kleur te wijzigen</li>
            <li>📷 Klik op groene knop om afbeeldingen/videos te uploaden</li>
            <li>💡 Wijzigingen worden automatisch opgeslagen</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default LiveEditor;