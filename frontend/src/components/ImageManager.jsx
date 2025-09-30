import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  Copy, 
  Download,
  Search,
  Filter,
  Grid3X3,
  List,
  Folder,
  Plus,
  Eye,
  Link2
} from 'lucide-react';

// Image Card Component
function ImageCard({ image, onSelect, onDelete, onEdit, selected }) {
  return (
    <Card className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}>
      <CardContent className="p-2">
        <div className="relative group">
          <img 
            src={image.url} 
            alt={image.alt || image.name}
            className="w-full h-32 object-cover rounded"
            onClick={() => onSelect(image)}
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => onSelect(image)}>
                <Eye size={14} />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onEdit(image)}>
                <Edit3 size={14} />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(image.url)}>
                <Copy size={14} />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(image.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-2 rounded-b">
            <p className="text-xs truncate">{image.name}</p>
            <p className="text-xs opacity-75">{formatFileSize(image.size)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Format file size helper
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main Image Manager Component
export default function ImageManager({ onSelect, multiSelect = false }) {
  const [images, setImages] = useState([
    {
      id: '1',
      name: 'sinterklaas-hero.jpg',
      url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800',
      alt: 'Sinterklaas en Pieten',
      size: 245760,
      type: 'image/jpeg',
      uploadDate: '2024-01-15',
      folder: 'heroes'
    },
    {
      id: '2', 
      name: 'children-happy.jpg',
      url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
      alt: 'Blije kinderen',
      size: 189432,
      type: 'image/jpeg',
      uploadDate: '2024-01-10',
      folder: 'gallery'
    },
    {
      id: '3',
      name: 'theater-stage.jpg', 
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      alt: 'Theater podium',
      size: 334567,
      type: 'image/jpeg',
      uploadDate: '2024-01-08',
      folder: 'venues'
    }
  ]);
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const fileInputRef = useRef(null);
  
  // Get unique folders
  const folders = ['all', ...new Set(images.map(img => img.folder))];
  
  // Filter images
  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.alt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || image.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  // Handle file upload
  const handleFileUpload = async (files) => {
    const newImages = [];
    
    for (let file of files) {
      if (file.type.startsWith('image/')) {
        // Create preview URL
        const url = URL.createObjectURL(file);
        
        const newImage = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          url: url,
          alt: file.name.split('.')[0],
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString().split('T')[0],
          folder: 'uploads',
          file: file // Keep reference for actual upload
        };
        
        newImages.push(newImage);
      }
    }
    
    setImages([...images, ...newImages]);
    toast.success(`${newImages.length} afbeelding(en) geüpload!`);
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Select image
  const handleSelectImage = (image) => {
    if (multiSelect) {
      setSelectedImages(prev => {
        const isSelected = prev.find(img => img.id === image.id);
        if (isSelected) {
          return prev.filter(img => img.id !== image.id);
        } else {
          return [...prev, image];
        }
      });
    } else {
      setSelectedImages([image]);
      if (onSelect) {
        onSelect(image);
      }
    }
  };

  // Delete image
  const deleteImage = (imageId) => {
    if (window.confirm('Weet je zeker dat je deze afbeelding wilt verwijderen?')) {
      setImages(images.filter(img => img.id !== imageId));
      setSelectedImages(selectedImages.filter(img => img.id !== imageId));
      toast.success('Afbeelding verwijderd!');
    }
  };

  // Edit image
  const editImage = (image) => {
    setEditingImage({...image});
  };

  const saveImageEdit = () => {
    setImages(images.map(img => 
      img.id === editingImage.id ? editingImage : img
    ));
    setEditingImage(null);
    toast.success('Afbeelding bijgewerkt!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon size={24} />
          Afbeelding Manager
        </h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUpload(true)}>
            <Upload size={16} className="mr-2" />
            Upload
          </Button>
          
          {selectedImages.length > 0 && (
            <Button onClick={() => onSelect && onSelect(multiSelect ? selectedImages : selectedImages[0])}>
              <Eye size={16} className="mr-2" />
              Selecteren ({selectedImages.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Zoek afbeeldingen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <select 
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="p-2 border rounded"
          >
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder === 'all' ? 'Alle Mappen' : folder}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Images Grid/List */}
      <div 
        className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {filteredImages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <ImageIcon size={48} className="mx-auto mb-4" />
            <h3 className="text-lg mb-2">Geen afbeeldingen gevonden</h3>
            <p>Upload afbeeldingen of pas je zoekopdracht aan</p>
          </div>
        ) : (
          filteredImages.map(image => (
            viewMode === 'grid' ? (
              <ImageCard
                key={image.id}
                image={image}
                onSelect={handleSelectImage}
                onDelete={deleteImage}
                onEdit={editImage}
                selected={selectedImages.some(img => img.id === image.id)}
              />
            ) : (
              <Card key={image.id} className={`cursor-pointer ${selectedImages.some(img => img.id === image.id) ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={image.url} 
                      alt={image.alt}
                      className="w-16 h-16 object-cover rounded"
                      onClick={() => handleSelectImage(image)}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{image.name}</h3>
                      <p className="text-sm text-gray-500">{image.alt}</p>
                      <div className="flex gap-4 text-xs text-gray-400 mt-1">
                        <span>{formatFileSize(image.size)}</span>
                        <span>{image.uploadDate}</span>
                        <Badge variant="outline">{image.folder}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleSelectImage(image)}>
                        <Eye size={14} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => editImage(image)}>
                        <Edit3 size={14} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(image.url)}>
                        <Copy size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteImage(image.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Afbeeldingen Uploaden</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="mb-2">Sleep afbeeldingen hierheen of klik om te selecteren</p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF tot 10MB</p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(Array.from(e.target.files))}
              className="hidden"
            />
            
            <div className="space-y-2">
              <Label>Afbeelding URL</Label>
              <div className="flex gap-2">
                <Input placeholder="https://example.com/image.jpg" />
                <Button>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Image Dialog */}
      {editingImage && (
        <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Afbeelding Bewerken</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <img 
                  src={editingImage.url} 
                  alt={editingImage.alt}
                  className="w-full rounded"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Bestandsnaam</Label>
                  <Input
                    value={editingImage.name}
                    onChange={(e) => setEditingImage({...editingImage, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Alt Tekst</Label>
                  <Input
                    value={editingImage.alt}
                    onChange={(e) => setEditingImage({...editingImage, alt: e.target.value})}
                    placeholder="Beschrijving voor toegankelijkheid"
                  />
                </div>
                
                <div>
                  <Label>Map</Label>
                  <select
                    value={editingImage.folder}
                    onChange={(e) => setEditingImage({...editingImage, folder: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="uploads">Uploads</option>
                    <option value="heroes">Heroes</option>
                    <option value="gallery">Gallery</option>
                    <option value="venues">Venues</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <div className="flex gap-2">
                    <Button onClick={saveImageEdit}>
                      <Save size={16} className="mr-2" />
                      Opslaan
                    </Button>
                    <Button variant="outline" onClick={() => setEditingImage(null)}>
                      Annuleren
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Quick Stats */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{filteredImages.length} afbeeldingen gevonden</span>
          <span>{selectedImages.length} geselecteerd</span>
        </div>
      </div>
    </div>
  );
}
