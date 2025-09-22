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
    if (!isDirty) {
      console.log('⚠️ No changes to save');
      return;
    }
    
    console.log('💾 Starting auto-save...');
    setSaving(true);
    
    try {
      const contentUpdates = [];
      
      // Collect all editable elements and their current values
      console.log('📋 Collecting content from elements:', editableElementsRef.current);
      
      editableElementsRef.current.forEach((element, key) => {
        const [section, type, contentKey] = key.split('|');
        const value = type === 'image' ? element.src : (element.textContent || element.innerText);
        
        console.log(`📝 Collecting: ${key} = "${value}"`);
        
        contentUpdates.push({
          section,
          type,
          key: contentKey,
          value
        });
      });

      console.log('📤 Sending content updates:', contentUpdates);

      if (contentUpdates.length > 0) {
        const response = await fetch(`${API}/admin/content`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contentUpdates)
        });

        const responseText = await response.text();
        console.log('📥 Server response:', response.status, responseText);

        if (response.ok) {
          setIsDirty(false);
          setLastSaved(new Date());
          toast.success(`✅ ${contentUpdates.length} wijzigingen opgeslagen!`);
          console.log('✅ Auto-save successful');
          
          // Trigger a page refresh to show changes
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          throw new Error(`Auto-save failed: ${response.status} - ${responseText}`);
        }
      } else {
        console.log('⚠️ No content updates to save');
        toast.warning('Geen wijzigingen om op te slaan');
      }
    } catch (error) {
      console.error('❌ Auto-save error:', error);
      toast.error('Auto-save fout: ' + error.message);
    }
    setSaving(false);
  };

  const makeElementEditable = (element, section, type, key) => {
    if (!element) return;

    const elementKey = `${section}|${type}|${key}`;
    editableElementsRef.current.set(elementKey, element);

    // Add visual editing indicators with stronger styling
    element.classList.add('live-editable');
    element.setAttribute('data-editable', 'true');
    element.setAttribute('data-section', section);
    element.setAttribute('data-type', type);
    element.setAttribute('data-key', key);

    // Apply immediate visual styling
    element.style.border = '2px dashed #3b82f6';
    element.style.borderRadius = '4px';
    element.style.padding = '4px';
    element.style.margin = '2px';
    element.style.minHeight = '20px';

    if (type === 'text') {
      element.contentEditable = true;
      element.style.cursor = 'text';
      element.style.outline = 'none';
      
      // Remove existing listeners first
      const newInputHandler = (e) => {
        console.log('📝 Text changed:', e.target.textContent);
        setIsDirty(true);
        e.target.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
        e.target.style.borderColor = '#f59e0b';
      };
      
      const newBlurHandler = (e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.borderColor = '#3b82f6';
      };
      
      const newKeyHandler = (e) => {
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          handleAutoSave();
        }
      };
      
      element.addEventListener('input', newInputHandler);
      element.addEventListener('blur', newBlurHandler);
      element.addEventListener('keydown', newKeyHandler);
      
      // Store handlers for cleanup
      element._liveEditHandlers = { input: newInputHandler, blur: newBlurHandler, keydown: newKeyHandler };
      
      console.log('✅ Text element made editable:', element);
    } else if (type === 'image') {
      element.style.cursor = 'pointer';
      
      const newClickHandler = (e) => handleImageClick(e);
      element.addEventListener('click', newClickHandler);
      element._liveEditHandlers = { click: newClickHandler };
      
      console.log('✅ Image element made clickable:', element);
    }
  };

  // These handlers are now defined inline in makeElementEditable for better control

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
    console.log(`🔄 Toggling edit mode: ${editMode} -> ${newEditMode}`);
    setEditMode(newEditMode);
    
    if (newEditMode) {
      // Entering edit mode
      console.log('🚀 Entering edit mode...');
      toast.success('Edit mode geactiveerd!');
      
      // Wait for React to finish rendering
      setTimeout(() => {
        addEditableElements();
      }, 500);
    } else {
      // Exiting edit mode
      console.log('🛑 Exiting edit mode...');
      removeEditableElements();
      
      if (isDirty) {
        console.log('💾 Saving changes before exit...');
        handleAutoSave();
      }
      
      toast.success('Edit mode uitgeschakeld!');
    }
  };

  const addEditableElements = () => {
    console.log('🔍 Looking for editable elements...');
    
    // Find text elements
    const textElements = document.querySelectorAll('[data-editable-text]');
    console.log(`Found ${textElements.length} text elements:`, textElements);
    
    textElements.forEach(element => {
      const section = element.dataset.section || pageKey;
      const key = element.dataset.key || element.dataset.editableText || 'unknown';
      console.log(`Making text element editable: ${section}|${key}`, element);
      makeElementEditable(element, section, 'text', key);
    });

    // Find image elements  
    const imageElements = document.querySelectorAll('[data-editable-image]');
    console.log(`Found ${imageElements.length} image elements:`, imageElements);
    
    imageElements.forEach(element => {
      const section = element.dataset.section || pageKey;
      const key = element.dataset.key || element.dataset.editableImage || 'unknown';
      console.log(`Making image element editable: ${section}|${key}`, element);
      makeElementEditable(element, section, 'image', key);
    });

    const totalElements = textElements.length + imageElements.length;
    console.log(`✅ Total editable elements processed: ${totalElements}`);
    
    if (totalElements > 0) {
      toast.success(`${totalElements} bewerkbare elementen gevonden!`);
    } else {
      toast.error('Geen bewerkbare elementen gevonden. Controleer data-attributen.');
    }
  };

  const removeEditableElements = () => {
    console.log('🧹 Cleaning up editable elements...');
    
    editableElementsRef.current.forEach((element) => {
      // Remove visual styling
      element.classList.remove('live-editable', 'live-editing');
      element.style.border = '';
      element.style.borderRadius = '';
      element.style.padding = '';
      element.style.margin = '';
      element.style.cursor = '';
      element.style.backgroundColor = '';
      element.style.minHeight = '';
      
      // Remove attributes
      element.removeAttribute('contenteditable');
      element.removeAttribute('data-editable');
      
      // Remove event listeners using stored handlers
      if (element._liveEditHandlers) {
        Object.entries(element._liveEditHandlers).forEach(([event, handler]) => {
          element.removeEventListener(event, handler);
        });
        delete element._liveEditHandlers;
      }
    });
    
    editableElementsRef.current.clear();
    console.log('✅ Cleanup complete');
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