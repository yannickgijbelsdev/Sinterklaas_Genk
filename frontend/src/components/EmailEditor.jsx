import React, { useState, useRef, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Minus, 
  Eye, 
  Save, 
  Trash2,
  GripVertical,
  Plus,
  Palette,
  Link,
  Mail
} from 'lucide-react';

// Draggable Email Block Component
function EmailBlock({ id, block, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleUpdate = (field, value) => {
    onUpdate(id, { ...block, [field]: value });
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical size={16} {...attributes} {...listeners} className="cursor-grab text-gray-400" />
              <span className="text-sm font-medium capitalize">{block.type} Block</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {block.type === 'text' && (
            <div className="space-y-3">
              <div>
                <Label>Tekst</Label>
                <Textarea
                  value={block.content || ''}
                  onChange={(e) => handleUpdate('content', e.target.value)}
                  placeholder="Voer je tekst in..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Tekstgrootte</Label>
                  <select
                    value={block.fontSize || '16px'}
                    onChange={(e) => handleUpdate('fontSize', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="12px">Klein</option>
                    <option value="16px">Normaal</option>
                    <option value="20px">Groot</option>
                    <option value="24px">Extra Groot</option>
                  </select>
                </div>
                <div>
                  <Label>Kleur</Label>
                  <Input
                    type="color"
                    value={block.color || '#000000'}
                    onChange={(e) => handleUpdate('color', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={block.bold ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdate('bold', !block.bold)}
                >
                  <strong>B</strong>
                </Button>
                <Button
                  variant={block.italic ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdate('italic', !block.italic)}
                >
                  <em>I</em>
                </Button>
              </div>
            </div>
          )}

          {block.type === 'image' && (
            <div className="space-y-3">
              <div>
                <Label>Afbeelding URL</Label>
                <Input
                  value={block.src || ''}
                  onChange={(e) => handleUpdate('src', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>Alt tekst</Label>
                <Input
                  value={block.alt || ''}
                  onChange={(e) => handleUpdate('alt', e.target.value)}
                  placeholder="Beschrijving van de afbeelding"
                />
              </div>
              <div>
                <Label>Breedte</Label>
                <select
                  value={block.width || '100%'}
                  onChange={(e) => handleUpdate('width', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="100%">Vol (100%)</option>
                  <option value="50%">Half (50%)</option>
                  <option value="300px">Klein (300px)</option>
                  <option value="600px">Groot (600px)</option>
                </select>
              </div>
              {block.src && (
                <div className="mt-2">
                  <img src={block.src} alt={block.alt} className="max-w-full h-32 object-cover rounded" />
                </div>
              )}
            </div>
          )}

          {block.type === 'button' && (
            <div className="space-y-3">
              <div>
                <Label>Knop tekst</Label>
                <Input
                  value={block.text || ''}
                  onChange={(e) => handleUpdate('text', e.target.value)}
                  placeholder="Klik hier"
                />
              </div>
              <div>
                <Label>Link URL</Label>
                <Input
                  value={block.url || ''}
                  onChange={(e) => handleUpdate('url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Achtergrondkleur</Label>
                  <Input
                    type="color"
                    value={block.backgroundColor || '#007cba'}
                    onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Tekstkleur</Label>
                  <Input
                    type="color"
                    value={block.textColor || '#ffffff'}
                    onChange={(e) => handleUpdate('textColor', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {block.type === 'divider' && (
            <div className="space-y-3">
              <div>
                <Label>Lijn kleur</Label>
                <Input
                  type="color"
                  value={block.color || '#cccccc'}
                  onChange={(e) => handleUpdate('color', e.target.value)}
                />
              </div>
              <div>
                <Label>Dikte</Label>
                <select
                  value={block.thickness || '1px'}
                  onChange={(e) => handleUpdate('thickness', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="1px">Dun</option>
                  <option value="2px">Normaal</option>
                  <option value="4px">Dik</option>
                </select>
              </div>
              <div className="border-t-2" style={{ borderColor: block.color || '#cccccc' }}></div>
            </div>
          )}

          {block.type === 'spacer' && (
            <div className="space-y-3">
              <div>
                <Label>Hoogte</Label>
                <select
                  value={block.height || '20px'}
                  onChange={(e) => handleUpdate('height', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="10px">Klein (10px)</option>
                  <option value="20px">Normaal (20px)</option>
                  <option value="40px">Groot (40px)</option>
                  <option value="60px">Extra Groot (60px)</option>
                </select>
              </div>
              <div 
                className="bg-gray-100 border-2 border-dashed border-gray-300 text-center text-sm text-gray-500 flex items-center justify-center"
                style={{ height: block.height || '20px' }}
              >
                Spacer ({block.height || '20px'})
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Email Editor Component
export function EmailEditor({ initialTemplate = null, onSave, onPreview }) {
  const [blocks, setBlocks] = useState(initialTemplate?.blocks || []);
  const [emailSettings, setEmailSettings] = useState({
    subject: initialTemplate?.subject || '',
    preheader: initialTemplate?.preheader || '',
    backgroundColor: initialTemplate?.backgroundColor || '#f8f9fa'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add new block
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Nieuwe tekst...' : undefined,
      src: type === 'image' ? '' : undefined,
      alt: type === 'image' ? '' : undefined,
      text: type === 'button' ? 'Klik hier' : undefined,
      url: type === 'button' ? '' : undefined,
      color: type === 'divider' ? '#cccccc' : '#000000',
      fontSize: type === 'text' ? '16px' : undefined,
      backgroundColor: type === 'button' ? '#007cba' : undefined,
      textColor: type === 'button' ? '#ffffff' : undefined,
      thickness: type === 'divider' ? '1px' : undefined,
      height: type === 'spacer' ? '20px' : undefined,
      width: type === 'image' ? '100%' : undefined
    };

    setBlocks([...blocks, newBlock]);
  };

  // Update block
  const updateBlock = (id, updatedBlock) => {
    setBlocks(blocks.map(block => block.id === id ? updatedBlock : block));
  };

  // Delete block
  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Generate HTML for preview/sending
  const generateHTML = () => {
    const blockHTML = blocks.map(block => {
      switch (block.type) {
        case 'text':
          return `
            <div style="margin: 20px 0; font-size: ${block.fontSize}; color: ${block.color}; ${block.bold ? 'font-weight: bold;' : ''} ${block.italic ? 'font-style: italic;' : ''}">
              ${block.content}
            </div>
          `;
        case 'image':
          return `
            <div style="margin: 20px 0; text-align: center;">
              <img src="${block.src}" alt="${block.alt}" style="width: ${block.width}; max-width: 100%; height: auto;" />
            </div>
          `;
        case 'button':
          return `
            <div style="margin: 20px 0; text-align: center;">
              <a href="${block.url}" style="display: inline-block; padding: 12px 24px; background-color: ${block.backgroundColor}; color: ${block.textColor}; text-decoration: none; border-radius: 4px; font-weight: bold;">
                ${block.text}
              </a>
            </div>
          `;
        case 'divider':
          return `
            <div style="margin: 20px 0;">
              <hr style="border: none; border-top: ${block.thickness} solid ${block.color};" />
            </div>
          `;
        case 'spacer':
          return `<div style="height: ${block.height};"></div>`;
        default:
          return '';
      }
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSettings.subject}</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        </style>
      </head>
      <body style="background-color: ${emailSettings.backgroundColor}; margin: 0; padding: 20px;">
        <div class="email-container" style="background-color: white; padding: 40px;">
          ${blockHTML}
        </div>
      </body>
      </html>
    `;
  };

  const handleSave = () => {
    const template = {
      subject: emailSettings.subject,
      preheader: emailSettings.preheader,
      backgroundColor: emailSettings.backgroundColor,
      blocks,
      html_content: generateHTML()
    };
    onSave(template);
  };

  const handlePreview = () => {
    const html = generateHTML();
    onPreview(html);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-screen">
      {/* Toolbar */}
      <div className="col-span-3 bg-gray-50 p-4 overflow-y-auto">
        <h3 className="font-bold mb-4">Email Blokken</h3>
        
        <div className="space-y-2 mb-6">
          <Button onClick={() => addBlock('text')} className="w-full justify-start" variant="outline">
            <Type className="mr-2" size={16} />
            Tekst
          </Button>
          <Button onClick={() => addBlock('image')} className="w-full justify-start" variant="outline">
            <ImageIcon className="mr-2" size={16} />
            Afbeelding
          </Button>
          <Button onClick={() => addBlock('button')} className="w-full justify-start" variant="outline">
            <Square className="mr-2" size={16} />
            Knop
          </Button>
          <Button onClick={() => addBlock('divider')} className="w-full justify-start" variant="outline">
            <Minus className="mr-2" size={16} />
            Scheidingslijn
          </Button>
          <Button onClick={() => addBlock('spacer')} className="w-full justify-start" variant="outline">
            <Plus className="mr-2" size={16} />
            Ruimte
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Email onderwerp</Label>
            <Input
              value={emailSettings.subject}
              onChange={(e) => setEmailSettings({...emailSettings, subject: e.target.value})}
              placeholder="Email onderwerp"
            />
          </div>
          <div>
            <Label>Preheader tekst</Label>
            <Input
              value={emailSettings.preheader}
              onChange={(e) => setEmailSettings({...emailSettings, preheader: e.target.value})}
              placeholder="Preview tekst"
            />
          </div>
          <div>
            <Label>Achtergrond kleur</Label>
            <Input
              type="color"
              value={emailSettings.backgroundColor}
              onChange={(e) => setEmailSettings({...emailSettings, backgroundColor: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Button onClick={handlePreview} className="w-full" variant="outline">
            <Eye className="mr-2" size={16} />
            Voorbeeld
          </Button>
          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2" size={16} />
            Opslaan
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="col-span-9 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6" style={{ backgroundColor: emailSettings.backgroundColor }}>
            <div className="bg-white p-8 rounded">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                  {blocks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Mail size={48} className="mx-auto mb-4" />
                      <p>Sleep blokken hierheen om je email te maken</p>
                    </div>
                  ) : (
                    blocks.map((block) => (
                      <EmailBlock
                        key={block.id}
                        id={block.id}
                        block={block}
                        onUpdate={updateBlock}
                        onDelete={deleteBlock}
                      />
                    ))
                  )}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailEditor;
