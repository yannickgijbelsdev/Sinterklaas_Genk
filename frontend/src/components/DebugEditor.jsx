import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';

export const DebugEditor = () => {
  const [editMode, setEditMode] = useState(false);
  const [foundElements, setFoundElements] = useState([]);

  const findEditableElements = () => {
    const elements = [];
    
    // Find all elements with data-editable-text
    document.querySelectorAll('[data-editable-text]').forEach((el, index) => {
      elements.push({
        type: 'text',
        element: el,
        section: el.dataset.section,
        key: el.dataset.key,
        text: el.textContent?.substring(0, 50) + '...',
        index
      });
    });

    // Find all elements with data-editable-image
    document.querySelectorAll('[data-editable-image]').forEach((el, index) => {
      elements.push({
        type: 'image',
        element: el,
        section: el.dataset.section,
        key: el.dataset.key,
        src: el.src,
        index
      });
    });

    console.log('Found editable elements:', elements);
    setFoundElements(elements);
    return elements;
  };

  const makeElementEditable = (element, type) => {
    element.style.border = '2px dashed red';
    element.style.cursor = type === 'text' ? 'text' : 'pointer';
    
    if (type === 'text') {
      element.contentEditable = true;
      element.addEventListener('input', (e) => {
        console.log('Text changed:', e.target.textContent);
        toast.success('Text gewijzigd!');
      });
      element.addEventListener('focus', () => {
        element.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      });
      element.addEventListener('blur', () => {
        element.style.backgroundColor = 'transparent';
      });
    } else if (type === 'image') {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        toast.success('Afbeelding geklikt!');
        console.log('Image clicked:', e.target);
      });
    }
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    
    if (newEditMode) {
      // Wait a bit for React to render
      setTimeout(() => {
        const elements = findEditableElements();
        
        elements.forEach(({ element, type }) => {
          makeElementEditable(element, type);
        });
        
        toast.success(`Edit mode ON - ${elements.length} elementen gevonden`);
      }, 500);
    } else {
      // Remove editing
      foundElements.forEach(({ element }) => {
        element.style.border = '';
        element.style.cursor = '';
        element.style.backgroundColor = '';
        element.contentEditable = false;
      });
      setFoundElements([]);
      toast.success('Edit mode OFF');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 space-y-4">
      <Button
        onClick={toggleEditMode}
        className={editMode ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
      >
        {editMode ? 'Stop Debug' : 'Start Debug'}
      </Button>
      
      {editMode && (
        <Card className="w-80 max-h-60 overflow-y-auto">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Gevonden elementen: {foundElements.length}</h3>
            <div className="space-y-2 text-sm">
              {foundElements.map((item, i) => (
                <div key={i} className="border-b pb-2">
                  <div className="font-medium">{item.type === 'text' ? '📝' : '🖼️'} {item.section}.{item.key}</div>
                  <div className="text-gray-600 text-xs">
                    {item.type === 'text' ? item.text : 'Image: ' + (item.src?.substring(0, 30) + '...')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};