import React, { useState, useRef, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Upload, FileImage, Music, Link, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Compressor from 'compressorjs';
import { toast } from 'sonner';

const RichNewsEditor = ({ article, onSave, onCancel }) => {
  const { apiCall } = useAuth();
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'Algemeen',
    published: article?.published ?? true,
    featured_image: article?.featured_image || ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(article?.featured_image || '');

  // Compress and upload image
  const compressAndUploadImage = async (file, onProgress = () => {}) => {
    return new Promise((resolve, reject) => {
      // Compress image first
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 800,
        success: async (compressedFile) => {
          try {
            const formData = new FormData();
            formData.append('image', compressedFile);

            const response = await apiCall('/admin/news/upload-image', {
              method: 'POST',
              body: formData,
              onUploadProgress: onProgress
            });

            if (response.ok) {
              const result = await response.json();
              const imageUrl = result.image_url.startsWith('/') 
                ? `${process.env.REACT_APP_BACKEND_URL}${result.image_url}`
                : result.image_url;
              resolve(imageUrl);
            } else {
              reject(new Error('Upload failed'));
            }
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  // Upload audio file
  const uploadAudio = async (file) => {
    const formData = new FormData();
    formData.append('audio', file);

    const response = await apiCall('/admin/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      return `${process.env.REACT_APP_BACKEND_URL}${result.url}`;
    }
    throw new Error('Audio upload failed');
  };

  // Handle featured image upload with compression
  const handleFeaturedImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await compressAndUploadImage(file, (progress) => {
        setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
      });

      setFormData(prev => ({ ...prev, featured_image: imageUrl }));
      setFeaturedImagePreview(imageUrl);
      toast.success('Afbeelding geüpload!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Fout bij uploaden afbeelding');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // TinyMCE configuration
  const editorConfig = {
    height: 500,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | link image media | code | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.6; }',
    
    // Custom image upload handler
    images_upload_handler: async (blobInfo, progress) => {
      try {
        const imageUrl = await compressAndUploadImage(blobInfo.blob(), progress);
        return imageUrl;
      } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
      }
    },

    // Media/audio upload handler
    file_picker_callback: (callback, value, meta) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      
      if (meta.filetype === 'image') {
        input.setAttribute('accept', 'image/*');
      } else if (meta.filetype === 'media') {
        input.setAttribute('accept', 'audio/*,video/*');
      }

      input.onchange = async function () {
        const file = this.files[0];
        if (!file) return;

        try {
          let url;
          if (meta.filetype === 'image') {
            url = await compressAndUploadImage(file);
          } else {
            url = await uploadAudio(file);
          }
          
          callback(url, {
            title: file.name,
            alt: file.name
          });
        } catch (error) {
          toast.error('Bestand upload mislukt');
        }
      };

      input.click();
    },

    // Setup function
    setup: (editor) => {
      // Custom audio button
      editor.ui.registry.addButton('customAudio', {
        text: 'Audio',
        icon: 'audio',
        onAction: () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'audio/*');
          
          input.onchange = async function () {
            const file = this.files[0];
            if (!file) return;

            try {
              const audioUrl = await uploadAudio(file);
              const audioHtml = `
                <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                  <h4 style="margin: 0 0 10px 0;">🎵 ${file.name}</h4>
                  <audio controls style="width: 100%;">
                    <source src="${audioUrl}" type="${file.type}">
                    Uw browser ondersteunt dit audio element niet.
                  </audio>
                </div>
              `;
              editor.insertContent(audioHtml);
              toast.success('Audio toegevoegd!');
            } catch (error) {
              toast.error('Audio upload mislukt');
            }
          };

          input.click();
        }
      });

      // Add audio button to toolbar
      editor.settings.toolbar += ' | customAudio';
    }
  };

  const handleSave = async () => {
    try {
      const content = editorRef.current?.getContent() || '';
      const newsData = {
        ...formData,
        content: content,
        date: article?.date || new Date().toISOString()
      };

      await onSave(newsData);
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Fout bij opslaan artikel');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {article ? 'Artikel Bewerken' : 'Nieuw Artikel Maken'}
      </h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Titel</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Artikel titel..."
            className="mt-1"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Categorie</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Algemeen">Algemeen</option>
            <option value="Show Nieuws">Show Nieuws</option>
            <option value="Achter de Schermen">Achter de Schermen</option>
            <option value="Tips voor Ouders">Tips voor Ouders</option>
            <option value="Tradities">Tradities</option>
            <option value="Evenementen">Evenementen</option>
            <option value="Interviews">Interviews</option>
          </select>
        </div>

        {/* Featured Image */}
        <div>
          <Label>Uitgelichte Afbeelding</Label>
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFeaturedImageFile(file);
                    handleFeaturedImageUpload(file);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                disabled={uploading}
              />
              {uploading && (
                <div className="flex items-center text-sm text-gray-600">
                  <Upload className="animate-spin mr-2 h-4 w-4" />
                  {uploadProgress}%
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {/* Image Preview */}
            {featuredImagePreview && (
              <div className="relative">
                <img
                  src={featuredImagePreview}
                  alt="Preview"
                  className="h-48 w-64 object-cover rounded-lg border"
                />
                <Button
                  onClick={() => {
                    setFeaturedImagePreview('');
                    setFormData(prev => ({ ...prev, featured_image: '' }));
                  }}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  ×
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt">Samenvatting</Label>
          <Input
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Korte samenvatting van het artikel..."
            className="mt-1"
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <Label>Artikel Inhoud</Label>
          <div className="mt-2 border rounded-lg overflow-hidden">
            <Editor
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={formData.content}
              init={editorConfig}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                Afbeeldingen: Sleep & drop of gebruik de afbeelding knop
              </span>
              <span className="flex items-center gap-1">
                <Music className="h-4 w-4" />
                Audio: Gebruik de Audio knop in de toolbar
              </span>
              <span className="flex items-center gap-1">
                <Link className="h-4 w-4" />
                Links: Selecteer tekst en klik de link knop
              </span>
            </div>
          </div>
        </div>

        {/* Published Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <Label htmlFor="published">Artikel publiceren</Label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button onClick={onCancel} variant="outline">
            Annuleren
          </Button>
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            {article ? 'Bijwerken' : 'Opslaan'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RichNewsEditor;