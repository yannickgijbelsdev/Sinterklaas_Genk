import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Edit3, 
  Save, 
  Eye, 
  EyeOff, 
  Undo, 
  Redo,
  Type,
  Image as ImageIcon,
  Palette,
  RefreshCw
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const LiveEditor = ({ children, pageKey = 'home' }) => {
  const [editMode, setEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
  const editableElementsRef = useRef(new Map());

  // Auto-save mechanism
  useEffect(() => {
    if (isDirty && editMode) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save (2 seconds after last change)
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [isDirty, editMode]);

  const handleAutoSave = async () => {
    if (!isDirty) return;
    
    setSaving(true);
    try {
      const contentUpdates = [];
      
      // Collect all editable elements and their current values
      editableElementsRef.current.forEach((element, key) => {
        const [section, type, contentKey] = key.split('|');
        const value = type === 'image' ? element.src : element.textContent || element.innerText;
        
        contentUpdates.push({
          section,
          type,
          key: contentKey,
          value
        });
      });

      if (contentUpdates.length > 0) {
        const response = await fetch(`${API}/admin/content`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contentUpdates)
        });

        if (response.ok) {
          setIsDirty(false);
          setLastSaved(new Date());
          toast.success('Automatisch opgeslagen ✅');
        } else {
          throw new Error('Auto-save failed');
        }
      }
    } catch (error) {
      toast.error('Auto-save fout: ' + error.message);
    }
    setSaving(false);
  };

  const makeElementEditable = (element, section, type, key) => {
    if (!element) return;

    console.log(`Making element editable: ${section}|${type}|${key}`, element); // Debug log

    const elementKey = `${section}|${type}|${key}`;
    editableElementsRef.current.set(elementKey, element);

    // Add visual editing indicators
    element.classList.add('live-editable');
    element.setAttribute('data-editable', 'true');
    element.setAttribute('data-section', section);
    element.setAttribute('data-type', type);
    element.setAttribute('data-key', key);

    if (type === 'text') {
      element.contentEditable = true;
      element.style.cursor = 'text';
      
      // Remove existing listeners first
      element.removeEventListener('input', handleContentChange);
      element.removeEventListener('blur', handleContentBlur);
      element.removeEventListener('keydown', handleKeyDown);
      
      // Add new listeners
      element.addEventListener('input', handleContentChange);
      element.addEventListener('blur', handleContentBlur);
      element.addEventListener('keydown', handleKeyDown);
      
      console.log('Text element made editable:', element);
    } else if (type === 'image') {
      element.style.cursor = 'pointer';
      
      // Remove existing listener first
      element.removeEventListener('click', handleImageClick);
      
      // Add new listener
      element.addEventListener('click', handleImageClick);
      
      console.log('Image element made clickable:', element);
    }
  };

  const handleContentChange = (e) => {
    setIsDirty(true);
    
    // Visual feedback for unsaved changes
    e.target.classList.add('live-editing');
  };

  const handleContentBlur = (e) => {
    e.target.classList.remove('live-editing');
  };

  const handleKeyDown = (e) => {
    // Prevent line breaks in single-line elements like titles
    if (e.target.dataset.type === 'title' && e.key === 'Enter') {
      e.preventDefault();
    }
    
    // Save on Ctrl+S
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleAutoSave();
    }
  };

  const handleImageClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Image clicked for editing:', e.target);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      console.log('File selected:', file.name);
      toast.success('Uploading image...');

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API}/admin/upload`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          e.target.src = `${BACKEND_URL}${result.url}`;
          setIsDirty(true);
          toast.success('Afbeelding vervangen! 🎉');
          console.log('Image replaced successfully');
        } else {
          throw new Error(`Upload failed: ${response.status}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Fout bij uploaden: ' + error.message);
      }
    };
    input.click();
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    
    if (newEditMode) {
      // Entering edit mode
      console.log('Entering edit mode...');
      setTimeout(() => {
        addEditableElements();
      }, 100);
    } else {
      // Exiting edit mode
      console.log('Exiting edit mode...');
      removeEditableElements();
      if (isDirty) {
        handleAutoSave();
      }
    }
  };

  const addEditableElements = () => {
    // Find and make elements editable
    const editableSelectors = [
      '[data-editable-text]',
      '[data-editable-image]'
    ];

    editableSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        console.log('Found editable element:', element); // Debug log
        
        const section = element.dataset.section || pageKey;
        const type = element.dataset.editableText ? 'text' : 
                    element.dataset.editableImage ? 'image' : 'text';
        const key = element.dataset.key || 
                   element.dataset.editableText || 
                   element.dataset.editableImage ||
                   'unknown';

        console.log(`Making element editable: ${section}|${type}|${key}`); // Debug log
        makeElementEditable(element, section, type, key);
      });
    });

    // Also make images with data-editable-image clickable
    document.querySelectorAll('img[data-editable-image]').forEach(element => {
      console.log('Found editable image:', element);
      const section = element.dataset.section || pageKey;
      const key = element.dataset.key || element.dataset.editableImage || 'image';
      makeElementEditable(element, section, 'image', key);
    });
  };

  const removeEditableElements = () => {
    editableElementsRef.current.forEach((element) => {
      element.classList.remove('live-editable', 'live-editing');
      element.removeAttribute('contenteditable');
      element.removeAttribute('data-editable');
      element.removeEventListener('input', handleContentChange);
      element.removeEventListener('blur', handleContentBlur);
      element.removeEventListener('keydown', handleKeyDown);
      element.removeEventListener('click', handleImageClick);
    });
    editableElementsRef.current.clear();
  };

  return (
    <div className="relative">
      {/* Live Editor Toolbar */}
      {editMode && (
        <div className="fixed top-20 right-4 z-50">
          <Card className="shadow-2xl border-2 border-blue-200">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Edit3 size={16} className="text-blue-600" />
                  <span className="font-semibold text-sm">Live Editor</span>
                  <Badge variant={isDirty ? "destructive" : "default"}>
                    {isDirty ? 'Niet opgeslagen' : 'Opgeslagen'}
                  </Badge>
                </div>
                
                {saving && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <RefreshCw size={14} className="animate-spin" />
                    Aan het opslaan...
                  </div>
                )}
                
                {lastSaved && (
                  <div className="text-xs text-gray-500">
                    Laatst opgeslagen: {lastSaved.toLocaleTimeString('nl-NL')}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAutoSave}
                    disabled={!isDirty || saving}
                  >
                    <Save size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    <Undo size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleEditMode}
          className={`shadow-2xl ${editMode ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          size="lg"
        >
          {editMode ? (
            <>
              <EyeOff className="mr-2" size={18} />
              Stop Bewerken
            </>
          ) : (
            <>
              <Edit3 className="mr-2" size={18} />
              Bewerken
            </>
          )}
        </Button>
      </div>

      {/* Content with potential editing */}
      <div className={editMode ? 'live-editor-active' : ''}>
        {children}
      </div>

      {/* Instructions overlay */}
      {editMode && (
        <div className="fixed top-32 left-4 z-40">
          <Card className="shadow-lg bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="text-sm space-y-2">
                <div className="font-semibold text-yellow-800 flex items-center gap-2">
                  <Type size={16} />
                  Instructies:
                </div>
                <div className="text-yellow-700 space-y-1">
                  <div>• Klik op tekst om te bewerken</div>
                  <div>• Klik op afbeeldingen om te vervangen</div>
                  <div>• Wijzigingen worden automatisch opgeslagen</div>
                  <div>• Ctrl+S voor handmatig opslaan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};