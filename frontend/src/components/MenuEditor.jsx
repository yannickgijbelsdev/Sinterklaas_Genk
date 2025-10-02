import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  GripVertical,
  Menu,
  ChevronDown,
  ChevronRight,
  Link,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';

// Sortable Menu Item Component
function SortableMenuItem({ item, onUpdate, onDelete, onAddChild, level = 0 }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editData, setEditData] = useState({ label: item.label, url: item.url });
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginLeft: `${level * 20}px`
  };

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
    toast.success('Menu item bijgewerkt!');
  };

  const handleCancel = () => {
    setEditData({ label: item.label, url: item.url });
    setIsEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-2">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {/* Drag Handle */}
              <div {...attributes} {...listeners} className="cursor-grab">
                <GripVertical size={16} className="text-gray-400" />
              </div>
              
              {/* Expand/Collapse for items with children */}
              {item.children && item.children.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-6 h-6 p-0"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </Button>
              )}
              
              {/* Menu Item Content */}
              {isEditing ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    value={editData.label}
                    onChange={(e) => setEditData({...editData, label: e.target.value})}
                    placeholder="Menu label"
                    className="h-8"
                  />
                  <Input
                    value={editData.url}
                    onChange={(e) => setEditData({...editData, url: e.target.value})}
                    placeholder="URL (bijv. /about)"
                    className="h-8"
                  />
                  <Button size="sm" onClick={handleSave}>
                    <Save size={12} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium">{item.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.url}
                  </Badge>
                  {!item.visible && (
                    <Badge variant="secondary" className="text-xs">
                      <EyeOff size={10} className="mr-1" />
                      Verborgen
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            {!isEditing && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0"
                  onClick={() => onUpdate(item.id, { visible: !item.visible })}
                  title={item.visible ? "Verbergen" : "Tonen"}
                >
                  {item.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0"
                  onClick={() => onAddChild(item.id)}
                  title="Submenu toevoegen"
                >
                  <Plus size={12} />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={12} />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Render Children */}
      {isExpanded && item.children && item.children.length > 0 && (
        <div className="ml-4">
          {item.children.map(child => (
            <SortableMenuItem
              key={child.id}
              item={child}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Menu Editor Component
export default function MenuEditor() {
  const [menuItems, setMenuItems] = useState([
    {
      id: '1',
      label: 'Home',
      url: '/',
      visible: true,
      children: []
    },
    {
      id: '2',
      label: 'Over Ons',
      url: '/about',
      visible: true,
      children: []
    },
    {
      id: '3',
      label: 'Shows',
      url: '/shows',
      visible: true,
      children: [
        {
          id: '3-1',
          label: 'Sinterklaas Show',
          url: '/shows/sinterklaas',
          visible: true,
          children: []
        },
        {
          id: '3-2',
          label: 'Kerst Show',
          url: '/shows/kerst',
          visible: true,
          children: []
        }
      ]
    },
    {
      id: '4',
      label: 'Galerij',
      url: '/gallery',
      visible: true,
      children: []
    },
    {
      id: '5',
      label: 'Contact',
      url: '/contact',
      visible: true,
      children: []
    }
  ]);

  const [newItem, setNewItem] = useState({ label: '', url: '' });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Find item by ID (recursive)
  const findItem = (items, id) => {
    for (let item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Update menu item
  const updateMenuItem = (id, updates) => {
    const updateInArray = (items) => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.children) {
          return { ...item, children: updateInArray(item.children) };
        }
        return item;
      });
    };
    
    setMenuItems(updateInArray(menuItems));
  };

  // Delete menu item
  const deleteMenuItem = (id) => {
    const deleteFromArray = (items) => {
      return items.filter(item => {
        if (item.id === id) return false;
        if (item.children) {
          item.children = deleteFromArray(item.children);
        }
        return true;
      });
    };
    
    setMenuItems(deleteFromArray(menuItems));
    toast.success('Menu item verwijderd!');
  };

  // Add new menu item
  const addMenuItem = () => {
    if (!newItem.label || !newItem.url) {
      toast.error('Vul label en URL in');
      return;
    }
    
    const menuItem = {
      id: Date.now().toString(),
      label: newItem.label,
      url: newItem.url,
      visible: true,
      children: []
    };
    
    setMenuItems([...menuItems, menuItem]);
    setNewItem({ label: '', url: '' });
    toast.success('Menu item toegevoegd!');
  };

  // Add child menu item
  const addChildMenuItem = (parentId) => {
    const addChildToArray = (items) => {
      return items.map(item => {
        if (item.id === parentId) {
          const newChild = {
            id: `${parentId}-${Date.now()}`,
            label: 'Nieuw Submenu',
            url: '/new-submenu',
            visible: true,
            children: []
          };
          return { ...item, children: [...item.children, newChild] };
        }
        if (item.children) {
          return { ...item, children: addChildToArray(item.children) };
        }
        return item;
      });
    };
    
    setMenuItems(addChildToArray(menuItems));
    toast.success('Submenu toegevoegd!');
  };

  // Save menu structure
  const saveMenu = async () => {
    try {
      // Here you would save to your backend
      console.log('Saving menu structure:', menuItems);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Menu opgeslagen!');
    } catch (error) {
      toast.error('Fout bij opslaan: ' + error.message);
    }
  };

  // Generate menu preview
  const generateMenuPreview = (items, level = 0) => {
    return items.filter(item => item.visible).map(item => (
      <div key={item.id} style={{ marginLeft: `${level * 20}px` }} className="py-1">
        <a href={item.url} className="text-blue-600 hover:underline">
          {item.label}
        </a>
        {item.children && item.children.length > 0 && (
          <div>
            {generateMenuPreview(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Menu size={24} />
          Menu Editor
        </h1>
        <Button onClick={saveMenu}>
          <Save size={16} className="mr-2" />
          Menu Opslaan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Structure Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Structuur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Menu label (bijv: Over Ons)"
                    value={newItem.label}
                    onChange={(e) => setNewItem({...newItem, label: e.target.value})}
                  />
                  <Input
                    placeholder="URL (bijv: /about)"
                    value={newItem.url}
                    onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                  />
                  <Button onClick={addMenuItem}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={menuItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {menuItems.map(item => (
                      <SortableMenuItem
                        key={item.id}
                        item={item}
                        onUpdate={updateMenuItem}
                        onDelete={deleteMenuItem}
                        onAddChild={addChildMenuItem}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              
              {menuItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Menu size={48} className="mx-auto mb-2" />
                  <p>Geen menu items. Voeg er een toe om te beginnen.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Menu Preview & Settings */}
        <div className="space-y-4">
          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={16} />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded border">
                <nav>
                  {generateMenuPreview(menuItems)}
                </nav>
              </div>
            </CardContent>
          </Card>
          
          {/* Menu Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={16} />
                Menu Instellingen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Menu Positie</Label>
                <select className="w-full p-2 border rounded">
                  <option>Horizontaal - Bovenkant</option>
                  <option>Verticaal - Links</option>
                  <option>Verticaal - Rechts</option>
                </select>
              </div>
              
              <div>
                <Label>Menu Stijl</Label>
                <select className="w-full p-2 border rounded">
                  <option>Standaard</option>
                  <option>Dropdown</option>
                  <option>Mega Menu</option>
                  <option>Hamburger (Mobiel)</option>
                </select>
              </div>
              
              <div>
                <Label>Achtergrondkleur</Label>
                <Input type="color" defaultValue="#ffffff" />
              </div>
              
              <div>
                <Label>Tekstkleur</Label>
                <Input type="color" defaultValue="#333333" />
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="sticky" defaultChecked />
                <Label htmlFor="sticky">Sticky Menu (blijft bovenaan)</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="mobile-hamburger" defaultChecked />
                <Label htmlFor="mobile-hamburger">Hamburger menu op mobiel</Label>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus size={14} className="mr-2" />
                Standaard Pagina's Toevoegen
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Link size={14} className="mr-2" />
                Externe Link Toevoegen
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Menu size={14} className="mr-2" />
                Menu Template Laden
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
