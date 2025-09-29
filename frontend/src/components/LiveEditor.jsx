import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
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
  RefreshCw,
  Lock,
  Link,
  Smartphone,
  Tablet,
  Monitor,
  Upload
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const LiveEditor = ({ children, pageKey = 'home' }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  // Check if user is admin
  const isAdmin = () => user && user.is_admin;
  const [editMode, setEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [editModal, setEditModal] = useState({ show: false, type: '', data: {} });
  const [selectedElement, setSelectedElement] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
  const editableElementsRef = useRef(new Map());

  // Check if user has edit permissions
  const canEdit = isAuthenticated() && isAdmin();

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
          value: String(value) // Ensure value is always string
        });
      });

      console.log('📤 Sending content updates:', contentUpdates);

      if (contentUpdates.length > 0) {
        // Use direct fetch with token to avoid apiCall issues
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/content`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
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
    } else if (type === 'button') {
      element.style.cursor = 'pointer';
      
      const newClickHandler = (e) => handleElementClick(e);
      element.addEventListener('click', newClickHandler);
      element._liveEditHandlers = { click: newClickHandler };
      
      console.log('✅ Button element made clickable:', element);
    } else if (type === 'color') {
      element.style.cursor = 'pointer';
      
      const newClickHandler = (e) => handleElementClick(e);
      element.addEventListener('click', newClickHandler);
      element._liveEditHandlers = { click: newClickHandler };
      
      console.log('✅ Color element made clickable:', element);
    }
  };

  // These handlers are now defined inline in makeElementEditable for better control

  // Enhanced click handler for different content types
  const handleElementClick = useCallback((e) => {
    if (!editMode) return;
    
    e.preventDefault();
    e.stopPropagation();

    const element = e.target;
    
    // Determine content type and open appropriate editor
    if (element.hasAttribute('data-editable-button')) {
      // Button with text and link
      const section = element.getAttribute('data-section') || pageKey;
      const key = element.getAttribute('data-key') || element.getAttribute('data-editable-button');
      const currentText = element.textContent || element.innerText;
      const currentHref = element.href || element.getAttribute('href') || '#';
      
      setEditModal({
        show: true,
        type: 'button',
        data: {
          element,
          section,
          key,
          text: currentText,
          href: currentHref
        }
      });
      
    } else if (element.hasAttribute('data-editable-image')) {
      // Image editing
      const section = element.getAttribute('data-section') || pageKey;
      const key = element.getAttribute('data-key') || element.getAttribute('data-editable-image');
      
      setEditModal({
        show: true,
        type: 'image',
        data: {
          element,
          section,
          key,
          currentSrc: element.src,
          alt: element.alt || ''
        }
      });
      
    } else if (element.hasAttribute('data-editable-color')) {
      // Color editing
      const section = element.getAttribute('data-section') || pageKey;
      const key = element.getAttribute('data-key') || element.getAttribute('data-editable-color');
      const currentColor = window.getComputedStyle(element).backgroundColor || '#ffffff';
      
      setEditModal({
        show: true,
        type: 'color',
        data: {
          element,
          section,
          key,
          currentColor
        }
      });
      
    } else if (element.hasAttribute('data-editable-text')) {
      // Regular text editing (existing functionality)
      const section = element.getAttribute('data-section') || pageKey;
      const key = element.getAttribute('data-key') || element.getAttribute('data-editable-text');
      
      setEditModal({
        show: true,
        type: 'text',
        data: {
          element,
          section,
          key,
          text: element.textContent || element.innerText
        }
      });
    }
    
    setSelectedElement(element);
    element.classList.add('live-editor-selected');
  }, [editMode, pageKey]);

  // Modal editor components
  const renderEditModal = () => {
    if (!editModal.show) return null;

    const { type, data } = editModal;

    const closeModal = () => {
      if (selectedElement) {
        selectedElement.classList.remove('live-editor-selected');
      }
      setEditModal({ show: false, type: '', data: {} });
      setSelectedElement(null);
    };

    const saveChanges = async (newData) => {
      try {
        if (type === 'button') {
          // Update button text and link
          data.element.textContent = newData.text;
          data.element.href = newData.href;
          
          // Save both text and link to backend
          await Promise.all([
            apiCall('/admin/content', {
              method: 'PUT',
              body: JSON.stringify([{
                section: data.section,
                type: 'text',
                key: data.key + '_text',
                value: newData.text
              }])
            }),
            apiCall('/admin/content', {
              method: 'PUT', 
              body: JSON.stringify([{
                section: data.section,
                type: 'link',
                key: data.key + '_href',
                value: newData.href
              }])
            })
          ]);
          
        } else if (type === 'image') {
          // Update image src and alt
          data.element.src = newData.src;
          data.element.alt = newData.alt;
          
          await apiCall('/admin/content', {
            method: 'PUT',
            body: JSON.stringify([{
              section: data.section,
              type: 'image',
              key: data.key,
              value: newData.src
            }])
          });
          
        } else if (type === 'color') {
          // Update element color
          data.element.style.backgroundColor = newData.color;
          
          await apiCall('/admin/content', {
            method: 'PUT',
            body: JSON.stringify([{
              section: data.section,
              type: 'color',
              key: data.key,
              value: newData.color
            }])
          });
          
        } else if (type === 'text') {
          // Update text content
          data.element.textContent = newData.text;
          
          await apiCall('/admin/content', {
            method: 'PUT',
            body: JSON.stringify([{
              section: data.section,
              type: 'text',
              key: data.key,
              value: newData.text
            }])
          });
        }
        
        toast.success('✅ Wijzigingen opgeslagen!');
        closeModal();
        
      } catch (error) {
        console.error('Save error:', error);
        toast.error('❌ Fout bij opslaan: ' + error.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="p-6">
            {type === 'button' && <ButtonEditor data={data} onSave={saveChanges} onClose={closeModal} />}
            {type === 'image' && <ImageEditor data={data} onSave={saveChanges} onClose={closeModal} />}
            {type === 'color' && <ColorEditor data={data} onSave={saveChanges} onClose={closeModal} />}
            {type === 'text' && <TextEditor data={data} onSave={saveChanges} onClose={closeModal} />}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Individual editor components
  const ButtonEditor = ({ data, onSave, onClose }) => {
    const [text, setText] = useState(data.text);
    const [href, setHref] = useState(data.href);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Link size={20} />
          <span>Knop Bewerken</span>
        </div>
        
        <div>
          <Label htmlFor="button-text">Knop Tekst</Label>
          <Input
            id="button-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tekst op de knop"
          />
        </div>
        
        <div>
          <Label htmlFor="button-href">Link URL</Label>
          <Input
            id="button-href"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => onSave({ text, href })} className="flex-1">
            <Save size={16} className="mr-2" />
            Opslaan
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
        </div>
      </div>
    );
  };

  const ImageEditor = ({ data, onSave, onClose }) => {
    const [src, setSrc] = useState(data.currentSrc);
    const [alt, setAlt] = useState(data.alt);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiCall('/admin/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          setSrc(result.url);
          toast.success('Afbeelding geüpload!');
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        toast.error('Upload fout: ' + error.message);
      }
      setUploading(false);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <ImageIcon size={20} />
          <span>Afbeelding Bewerken</span>
        </div>
        
        <div className="text-center">
          <img src={src} alt={alt} className="max-w-full h-32 object-cover rounded mx-auto" />
        </div>
        
        <div>
          <Label htmlFor="image-upload">Nieuwe Afbeelding Uploaden</Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>

        <div>
          <Label htmlFor="image-url">Of URL Invoeren</Label>
          <Input
            id="image-url"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="image-alt">Alt Tekst</Label>
          <Input
            id="image-alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Beschrijving van de afbeelding"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => onSave({ src, alt })} className="flex-1" disabled={uploading}>
            <Save size={16} className="mr-2" />
            {uploading ? 'Bezig...' : 'Opslaan'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
        </div>
      </div>
    );
  };

  const ColorEditor = ({ data, onSave, onClose }) => {
    const [color, setColor] = useState(data.currentColor);
    
    const presetColors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
      '#3b82f6', '#8b5cf6', '#ec4899', '#f3f4f6', '#374151'
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Palette size={20} />
          <span>Kleur Bewerken</span>
        </div>
        
        <div>
          <Label htmlFor="color-picker">Kleur Kiezen</Label>
          <Input
            id="color-picker"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div>
          <Label>Vooringestelde Kleuren</Label>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {presetColors.map(presetColor => (
              <button
                key={presetColor}
                className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                style={{ backgroundColor: presetColor }}
                onClick={() => setColor(presetColor)}
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="color-input">Hex Kleur</Label>
          <Input
            id="color-input"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#ffffff"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => onSave({ color })} className="flex-1">
            <Save size={16} className="mr-2" />
            Opslaan
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
        </div>
      </div>
    );
  };

  const TextEditor = ({ data, onSave, onClose }) => {
    const [text, setText] = useState(data.text);
    const isLongText = text.length > 100;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Type size={20} />
          <span>Tekst Bewerken</span>
        </div>
        
        <div>
          <Label htmlFor="text-content">Inhoud</Label>
          {isLongText ? (
            <Textarea
              id="text-content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          ) : (
            <Input
              id="text-content"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => onSave({ text })} className="flex-1">
            <Save size={16} className="mr-2" />
            Opslaan
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
        </div>
      </div>
    );
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

        const response = await apiCall('/admin/upload', {
          method: 'POST',
          body: formData,
          headers: {} // Remove Content-Type to let browser set it for FormData
        });

        if (response.ok) {
          const result = await response.json();
          e.target.src = `http://localhost:8001${result.url}`;
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
    if (!canEdit) {
      toast.error('Je moet ingelogd zijn als admin om te kunnen bewerken!');
      return;
    }

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
    
    // Find and register all editable elements
    const elementTypes = [
      { selector: '[data-editable-text]', type: 'text', attr: 'editableText' },
      { selector: '[data-editable-image]', type: 'image', attr: 'editableImage' },
      { selector: '[data-editable-button]', type: 'button', attr: 'editableButton' },
      { selector: '[data-editable-color]', type: 'color', attr: 'editableColor' }
    ];

    let totalElements = 0;
    elementTypes.forEach(({ selector, type, attr }) => {
      const elements = document.querySelectorAll(selector);
      console.log(`Found ${elements.length} ${type} elements:`, elements);
      
      elements.forEach(element => {
        const section = element.dataset.section || pageKey;
        const key = element.dataset.key || element.dataset[attr] || 'unknown';
        console.log(`Making ${type} element editable: ${section}|${key}`, element);
        makeElementEditable(element, section, type, key);
      });
      
      totalElements += elements.length;
    });

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
      {/* Live Editor Toolbar - Only show for authenticated admins */}
      {editMode && canEdit && isAuthenticated() && (
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

      {/* Edit Mode Toggle - Only show if user has permissions AND is authenticated */}
      {canEdit && isAuthenticated() && (
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
      )}

      {/* Content with potential editing */}
      <div className={editMode ? 'live-editor-active' : ''}>
        {children}
      </div>

      {/* Instructions overlay - Only show if editing and user has permissions AND is authenticated */}
      {editMode && canEdit && isAuthenticated() && (
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
                  <div>• Klik op knoppen om tekst en links te bewerken</div>
                  <div>• Klik op gekleurde elementen om kleuren te wijzigen</div>
                  <div>• Wijzigingen worden automatisch opgeslagen</div>
                  <div>• Ctrl+S voor handmatig opslaan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {renderEditModal()}
    </div>
  );
};