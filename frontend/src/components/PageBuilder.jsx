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
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Eye, 
  Undo, 
  Redo,
  GripVertical,
  Type,
  Image as ImageIcon,
  Square,
  Play,
  Minus,
  Columns,
  Smartphone,
  Tablet,
  Monitor,
  Palette,
  Link,
  Upload,
  Copy,
  Settings,
  Menu,
  ChevronDown
} from 'lucide-react';

// Block Types
const BLOCK_TYPES = {
  TEXT: 'text',
  HEADING: 'heading',
  IMAGE: 'image',
  BUTTON: 'button',
  VIDEO: 'video',
  SPACER: 'spacer',
  DIVIDER: 'divider',
  COLUMNS: 'columns',
  HTML: 'html'
};

// Default block configurations
const DEFAULT_BLOCKS = {
  [BLOCK_TYPES.TEXT]: {
    type: BLOCK_TYPES.TEXT,
    content: 'Klik om te bewerken...',
    style: {
      fontSize: '16px',
      color: '#333333',
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal'
    }
  },
  [BLOCK_TYPES.HEADING]: {
    type: BLOCK_TYPES.HEADING,
    content: 'Nieuwe Heading',
    level: 'h2',
    style: {
      fontSize: '32px',
      color: '#333333',
      textAlign: 'left',
      fontWeight: 'bold',
      margin: '20px 0'
    }
  },
  [BLOCK_TYPES.IMAGE]: {
    type: BLOCK_TYPES.IMAGE,
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    alt: 'Voorbeeld afbeelding',
    style: {
      width: '100%',
      maxWidth: '800px',
      height: 'auto',
      textAlign: 'center'
    }
  },
  [BLOCK_TYPES.BUTTON]: {
    type: BLOCK_TYPES.BUTTON,
    text: 'Klik Hier',
    url: '#',
    style: {
      backgroundColor: '#007cba',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '4px',
      textAlign: 'center',
      display: 'inline-block',
      textDecoration: 'none',
      fontWeight: 'bold'
    }
  },
  [BLOCK_TYPES.SPACER]: {
    type: BLOCK_TYPES.SPACER,
    height: '40px',
    style: {
      height: '40px',
      width: '100%'
    }
  },
  [BLOCK_TYPES.DIVIDER]: {
    type: BLOCK_TYPES.DIVIDER,
    style: {
      borderTop: '1px solid #cccccc',
      margin: '20px 0',
      width: '100%'
    }
  },
  [BLOCK_TYPES.COLUMNS]: {
    type: BLOCK_TYPES.COLUMNS,
    columns: [
      { id: '1', blocks: [], width: '50%' },
      { id: '2', blocks: [], width: '50%' }
    ],
    style: {
      display: 'flex',
      gap: '20px',
      width: '100%'
    }
  }
};

// Sortable Block Component
function SortableBlock({ block, onUpdate, onDelete, onDuplicate, isSelected, onSelect }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case BLOCK_TYPES.TEXT:
        return (
          <div 
            style={block.style}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(block.id, { content: e.target.textContent })}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      
      case BLOCK_TYPES.HEADING:
        const HeadingTag = block.level || 'h2';
        return React.createElement(HeadingTag, {
          style: block.style,
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: (e) => onUpdate(block.id, { content: e.target.textContent }),
          children: block.content
        });
      
      case BLOCK_TYPES.IMAGE:
        return (
          <div style={{ textAlign: block.style?.textAlign || 'center' }}>
            <img 
              src={block.src} 
              alt={block.alt}
              style={block.style}
              onClick={() => onSelect(block.id)}
            />
          </div>
        );
      
      case BLOCK_TYPES.BUTTON:
        return (
          <div style={{ textAlign: block.style?.textAlign || 'center' }}>
            <a 
              href={block.url}
              style={block.style}
              onClick={(e) => { e.preventDefault(); onSelect(block.id); }}
            >
              {block.text}
            </a>
          </div>
        );
      
      case BLOCK_TYPES.SPACER:
        return (
          <div 
            style={block.style}
            className="bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm"
          >
            Spacer ({block.height})
          </div>
        );
      
      case BLOCK_TYPES.DIVIDER:
        return <hr style={block.style} />;
      
      default:
        return <div>Onbekend block type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group mb-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(block.id)}
    >
      {/* Block Content */}
      <div className="relative">
        {renderBlockContent()}
        
        {/* Block Controls */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={12} />
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(block.id);
            }}
          >
            <Copy size={12} />
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            className="w-8 h-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Block Library Sidebar
function BlockLibrary({ onAddBlock }) {
  const blockTypes = [
    { type: BLOCK_TYPES.TEXT, icon: Type, label: 'Tekst' },
    { type: BLOCK_TYPES.HEADING, icon: Type, label: 'Heading' },
    { type: BLOCK_TYPES.IMAGE, icon: ImageIcon, label: 'Afbeelding' },
    { type: BLOCK_TYPES.BUTTON, icon: Square, label: 'Knop' },
    { type: BLOCK_TYPES.SPACER, icon: Minus, label: 'Ruimte' },
    { type: BLOCK_TYPES.DIVIDER, icon: Minus, label: 'Lijn' },
    { type: BLOCK_TYPES.COLUMNS, icon: Columns, label: 'Kolommen' }
  ];

  return (
    <div className="w-64 bg-gray-50 border-r p-4 h-full overflow-y-auto">
      <h3 className="font-bold mb-4">Blokken Bibliotheek</h3>
      
      <div className="space-y-2">
        {blockTypes.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddBlock(type)}
          >
            <Icon className="mr-2" size={16} />
            {label}
          </Button>
        ))}
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium mb-2">Template Blokken</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start text-sm">
            <Type className="mr-2" size={14} />
            Hero Sectie
          </Button>
          <Button variant="outline" className="w-full justify-start text-sm">
            <Columns className="mr-2" size={14} />
            Feature Grid
          </Button>
          <Button variant="outline" className="w-full justify-start text-sm">
            <ImageIcon className="mr-2" size={14} />
            Testimonial
          </Button>
        </div>
      </div>
    </div>
  );
}

// Properties Panel
function PropertiesPanel({ selectedBlock, onUpdateBlock }) {
  if (!selectedBlock) {
    return (
      <div className="w-80 bg-gray-50 border-l p-4">
        <div className="text-center text-gray-500 mt-8">
          <Settings size={48} className="mx-auto mb-2" />
          <p>Selecteer een blok om eigenschappen te bewerken</p>
        </div>
      </div>
    );
  }

  const updateStyle = (property, value) => {
    onUpdateBlock(selectedBlock.id, {
      style: { ...selectedBlock.style, [property]: value }
    });
  };

  const updateProperty = (property, value) => {
    onUpdateBlock(selectedBlock.id, { [property]: value });
  };

  return (
    <div className="w-80 bg-gray-50 border-l p-4 h-full overflow-y-auto">
      <h3 className="font-bold mb-4">Eigenschappen</h3>
      
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Inhoud</TabsTrigger>
          <TabsTrigger value="style">Styling</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          {selectedBlock.type === BLOCK_TYPES.TEXT && (
            <div>
              <Label>Tekst Inhoud</Label>
              <Textarea
                value={selectedBlock.content || ''}
                onChange={(e) => updateProperty('content', e.target.value)}
                rows={4}
              />
            </div>
          )}
          
          {selectedBlock.type === BLOCK_TYPES.HEADING && (
            <>
              <div>
                <Label>Heading Tekst</Label>
                <Input
                  value={selectedBlock.content || ''}
                  onChange={(e) => updateProperty('content', e.target.value)}
                />
              </div>
              <div>
                <Label>Heading Type</Label>
                <select
                  value={selectedBlock.level || 'h2'}
                  onChange={(e) => updateProperty('level', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="h1">H1 - Zeer Groot</option>
                  <option value="h2">H2 - Groot</option>
                  <option value="h3">H3 - Medium</option>
                  <option value="h4">H4 - Klein</option>
                </select>
              </div>
            </>
          )}
          
          {selectedBlock.type === BLOCK_TYPES.IMAGE && (
            <>
              <div>
                <Label>Afbeelding URL</Label>
                <Input
                  value={selectedBlock.src || ''}
                  onChange={(e) => updateProperty('src', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>Alt Tekst</Label>
                <Input
                  value={selectedBlock.alt || ''}
                  onChange={(e) => updateProperty('alt', e.target.value)}
                />
              </div>
            </>
          )}
          
          {selectedBlock.type === BLOCK_TYPES.BUTTON && (
            <>
              <div>
                <Label>Knop Tekst</Label>
                <Input
                  value={selectedBlock.text || ''}
                  onChange={(e) => updateProperty('text', e.target.value)}
                />
              </div>
              <div>
                <Label>Link URL</Label>
                <Input
                  value={selectedBlock.url || ''}
                  onChange={(e) => updateProperty('url', e.target.value)}
                />
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Tekstkleur</Label>
              <Input
                type="color"
                value={selectedBlock.style?.color || '#333333'}
                onChange={(e) => updateStyle('color', e.target.value)}
              />
            </div>
            <div>
              <Label>Achtergrond</Label>
              <Input
                type="color"
                value={selectedBlock.style?.backgroundColor || '#transparent'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label>Lettergrootte</Label>
            <select
              value={selectedBlock.style?.fontSize || '16px'}
              onChange={(e) => updateStyle('fontSize', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="12px">Klein (12px)</option>
              <option value="14px">Klein-Medium (14px)</option>
              <option value="16px">Normaal (16px)</option>
              <option value="18px">Groot (18px)</option>
              <option value="24px">Extra Groot (24px)</option>
              <option value="32px">Zeer Groot (32px)</option>
            </select>
          </div>
          
          <div>
            <Label>Tekst Uitlijning</Label>
            <select
              value={selectedBlock.style?.textAlign || 'left'}
              onChange={(e) => updateStyle('textAlign', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="left">Links</option>
              <option value="center">Centrum</option>
              <option value="right">Rechts</option>
              <option value="justify">Uitgevuld</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedBlock.style?.fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={() => updateStyle('fontWeight', selectedBlock.style?.fontWeight === 'bold' ? 'normal' : 'bold')}
            >
              <strong>B</strong>
            </Button>
            <Button
              size="sm"
              variant={selectedBlock.style?.fontStyle === 'italic' ? 'default' : 'outline'}
              onClick={() => updateStyle('fontStyle', selectedBlock.style?.fontStyle === 'italic' : 'normal' : 'italic')}
            >
              <em>I</em>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main Page Builder Component
export default function PageBuilder({ pageKey = 'home', onSave, onPreview }) {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add new block
  const addBlock = (blockType) => {
    const newBlock = {
      id: Date.now().toString(),
      ...DEFAULT_BLOCKS[blockType]
    };
    
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    saveToHistory(updatedBlocks);
    toast.success(`${blockType} blok toegevoegd!`);
  };

  // Update block
  const updateBlock = (blockId, updates) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    setBlocks(updatedBlocks);
    saveToHistory(updatedBlocks);
  };

  // Delete block
  const deleteBlock = (blockId) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(updatedBlocks);
    saveToHistory(updatedBlocks);
    setSelectedBlock(null);
    toast.success('Blok verwijderd!');
  };

  // Duplicate block
  const duplicateBlock = (blockId) => {
    const blockToDuplicate = blocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: Date.now().toString()
      };
      
      const blockIndex = blocks.findIndex(block => block.id === blockId);
      const updatedBlocks = [
        ...blocks.slice(0, blockIndex + 1),
        duplicatedBlock,
        ...blocks.slice(blockIndex + 1)
      ];
      
      setBlocks(updatedBlocks);
      saveToHistory(updatedBlocks);
      toast.success('Blok gedupliceerd!');
    }
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const updatedBlocks = arrayMove(
        blocks,
        blocks.findIndex(block => block.id === active.id),
        blocks.findIndex(block => block.id === over.id)
      );
      setBlocks(updatedBlocks);
      saveToHistory(updatedBlocks);
    }
  };

  // History management
  const saveToHistory = (newBlocks) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newBlocks]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks([...history[historyIndex + 1]]);
    }
  };

  // Save page
  const savePage = () => {
    const pageData = {
      pageKey,
      blocks: blocks,
      lastModified: new Date().toISOString()
    };
    
    if (onSave) {
      onSave(pageData);
    } else {
      console.log('Saving page data:', pageData);
      toast.success('Pagina opgeslagen!');
    }
  };

  // Preview
  const previewPage = () => {
    if (onPreview) {
      onPreview(blocks);
    } else {
      console.log('Preview blocks:', blocks);
      toast.info('Preview functionaliteit');
    }
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-full';
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Block Library Sidebar */}
      <BlockLibrary onAddBlock={addBlock} />
      
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo size={16} />
            </Button>
            <Button size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo size={16} />
            </Button>
            
            <div className="mx-4 h-6 w-px bg-gray-300" />
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                onClick={() => setViewMode('desktop')}
              >
                <Monitor size={16} />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'tablet' ? 'default' : 'outline'}
                onClick={() => setViewMode('tablet')}
              >
                <Tablet size={16} />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {blocks.length} blokken
            </Badge>
            <Button size="sm" variant="outline" onClick={previewPage}>
              <Eye size={16} className="mr-1" />
              Preview
            </Button>
            <Button size="sm" onClick={savePage}>
              <Save size={16} className="mr-1" />
              Opslaan
            </Button>
          </div>
        </div>
        
        {/* Editor Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div className={`mx-auto bg-white shadow-lg min-h-96 ${getViewportClass()}`}>
            <div className="p-6">
              {blocks.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Type size={48} className="mx-auto mb-4" />
                  <h3 className="text-xl mb-2">Lege Pagina</h3>
                  <p>Sleep blokken hierheen om je pagina te bouwen</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        onUpdate={updateBlock}
                        onDelete={deleteBlock}
                        onDuplicate={duplicateBlock}
                        isSelected={selectedBlock?.id === block.id}
                        onSelect={(blockId) => {
                          const selected = blocks.find(b => b.id === blockId);
                          setSelectedBlock(selected);
                        }}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Properties Panel */}
      <PropertiesPanel
        selectedBlock={selectedBlock}
        onUpdateBlock={updateBlock}
      />
    </div>
  );
}
