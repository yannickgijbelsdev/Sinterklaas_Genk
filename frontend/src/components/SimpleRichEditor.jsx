import React, { useState, useRef, useCallback } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link, Image, 
  Music, Upload, Save, X, Eye, FileText, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import Compressor from 'compressorjs';
import { toast } from 'sonner';

const SimpleRichEditor = ({ article, onSave, onCancel }) => {
  const { apiCall } = useAuth();
  const contentRef = useRef(null);
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
  const [featuredImagePreview, setFeaturedImagePreview] = useState(article?.featured_image || '');
  const [showPreview, setShowPreview] = useState(false);

  // useCallback handlers to prevent input focus issues
  const handleTitleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  }, []);

  const handleExcerptChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, excerpt: e.target.value }));
  }, []);

  const handleContentChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  }, []);

  const handlePublishedChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, published: e.target.checked }));
  }, []);

  // Compress and upload image
  const compressAndUploadImage = async (file, onProgress = () => {}) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 800,
        success: async (compressedFile) => {
          try {
            const formData = new FormData();
            formData.append('file', compressedFile);

            // Use apiCall instead of XMLHttpRequest for proper auth
            const response = await apiCall('/admin/upload', {
              method: 'POST',
              body: formData
            });

            if (response.ok) {
              const result = await response.json();
              const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
              const imageUrl = `${backendUrl}${result.url}`;
              console.log('Image uploaded successfully:', imageUrl);
              resolve(imageUrl);
            } else {
              const errorText = await response.text();
              console.error('Upload failed:', response.status, errorText);
              reject(new Error(`Upload failed: ${response.status} ${errorText}`));
            }
          } catch (error) {
            console.error('Upload error:', error);
            reject(error);
          }
        },
        error: (error) => {
          console.error('Compression error:', error);
          reject(error);
        }
      });
    });
  };

  // Upload audio file
  const uploadAudio = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiCall('/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
        const audioUrl = `${backendUrl}${result.url}`;
        console.log('Audio uploaded successfully:', audioUrl);
        return audioUrl;
      } else {
        const errorText = await response.text();
        console.error('Audio upload failed:', response.status, errorText);
        throw new Error(`Audio upload failed: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Audio upload error:', error);
      throw error;
    }
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = async (file) => {
    if (!file) return;

    console.log('Starting featured image upload:', file.name, file.size, file.type);
    
    setUploading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await compressAndUploadImage(file, (progress) => {
        console.log('Upload progress:', progress);
        setUploadProgress(Math.round(progress));
      });

      console.log('Featured image uploaded successfully:', imageUrl);
      setFormData(prev => ({ ...prev, featured_image: imageUrl }));
      setFeaturedImagePreview(imageUrl);
      toast.success('Uitgelichte afbeelding geüpload!');
    } catch (error) {
      console.error('Error uploading featured image:', error);
      toast.error(`Fout bij uploaden afbeelding: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Insert content into textarea
  const insertContent = useCallback((content) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const newContent = text.substring(0, start) + content + text.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Set cursor position after inserted content
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + content.length;
      textarea.focus();
    }, 0);
  }, []);

  // Format text
  const formatText = (tag) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      let formattedText = '';
      switch (tag) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `<u>${selectedText}</u>`;
          break;
        case 'link':
          const url = prompt('Voer URL in:');
          if (url) formattedText = `[${selectedText}](${url})`;
          break;
        default:
          formattedText = selectedText;
      }
      // Replace selected text with formatted version
      const textarea = contentRef.current;
      const text = textarea.value;
      const newContent = text.substring(0, start) + formattedText + text.substring(end);
      setFormData(prev => ({ ...prev, content: newContent }));
      
      // Set cursor position after formatted content
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + formattedText.length;
        textarea.focus();
      }, 0);
    }
  };

  // Insert image from upload
  const handleImageInsert = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      console.log('Starting inline image upload:', file.name, file.size, file.type);

      try {
        toast.info('Afbeelding uploaden...');
        const imageUrl = await compressAndUploadImage(file, (progress) => {
          console.log('Inline image upload progress:', progress);
        });
        
        console.log('Inline image uploaded:', imageUrl);
        const imageMarkdown = `\n\n![${file.name}](${imageUrl})\n\n`;
        insertContent(imageMarkdown);
        toast.success('Afbeelding toegevoegd aan artikel!');
      } catch (error) {
        console.error('Error uploading inline image:', error);
        toast.error(`Fout bij uploaden afbeelding: ${error.message}`);
      }
    };

    input.click();
  };

  // Insert audio from upload
  const handleAudioInsert = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        toast.info('Audio uploaden...');
        const audioUrl = await uploadAudio(file);
        const audioHtml = `\n\n<div class="audio-container">
<h4>🎵 ${file.name}</h4>
<audio controls>
  <source src="${audioUrl}" type="${file.type}">
  Uw browser ondersteunt dit audio element niet.
</audio>
</div>\n\n`;
        insertContent(audioHtml);
        toast.success('Audio toegevoegd!');
      } catch (error) {
        toast.error('Fout bij uploaden audio');
      }
    };

    input.click();
  };

  const handleSave = async () => {
    try {
      const newsData = {
        ...formData,
        date: article?.date || new Date().toISOString()
      };

      await onSave(newsData);
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Fout bij opslaan artikel');
    }
  };

  // Convert simple markup to HTML for preview
  const renderPreview = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; margin: 10px 0;" />')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {article ? 'Artikel Bewerken' : 'Nieuw Artikel Maken'}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            {showPreview ? 'Editor' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
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
                    if (file) handleFeaturedImageUpload(file);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    {uploadProgress}%
                  </div>
                )}
              </div>

              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {featuredImagePreview && (
                <div className="relative">
                  <img
                    src={featuredImagePreview}
                    alt="Preview"
                    className="h-48 w-full object-cover rounded-lg border"
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
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Samenvatting</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Korte samenvatting van het artikel..."
              rows={3}
              className="mt-1"
            />
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
        </div>

        {/* Right Column - Content Editor */}
        <div className="space-y-4">
          <div>
            <Label>Artikel Inhoud</Label>
            
            {!showPreview ? (
              <>
                {/* Toolbar */}
                <div className="mt-2 p-2 border rounded-t-lg bg-gray-50 flex flex-wrap items-center gap-1">
                  <Button onClick={() => formatText('bold')} size="sm" variant="ghost" title="Vet">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => formatText('italic')} size="sm" variant="ghost" title="Cursief">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => formatText('underline')} size="sm" variant="ghost" title="Onderstreept">
                    <Underline className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <Button onClick={() => insertContent('\n- ')} size="sm" variant="ghost" title="Lijst">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => insertContent('\n1. ')} size="sm" variant="ghost" title="Genummerde lijst">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <Button onClick={() => formatText('link')} size="sm" variant="ghost" title="Link">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleImageInsert} size="sm" variant="ghost" title="Afbeelding">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleAudioInsert} size="sm" variant="ghost" title="Audio">
                    <Music className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content Textarea */}
                <Textarea
                  ref={contentRef}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Schrijf hier uw artikel inhoud...

Gebruik de toolbar knoppen voor opmaak:
- **vet** voor vette tekst
- *cursief* voor cursieve tekst  
- [link tekst](URL) voor links
- Upload afbeeldingen en audio via de knoppen"
                  rows={15}
                  className="rounded-t-none border-t-0 font-mono text-sm"
                />
              </>
            ) : (
              /* Preview */
              <div className="mt-2 p-4 border rounded-lg bg-white min-h-[400px]">
                <h3 className="text-xl font-bold mb-4">{formData.title}</h3>
                {featuredImagePreview && (
                  <img
                    src={featuredImagePreview}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-600 mb-4 italic">{formData.excerpt}</p>
                <div 
                  className="prose prose-red max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: renderPreview(formData.content) 
                  }}
                />
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Opmaak Tips:</h4>
            <ul className="space-y-1 text-xs">
              <li><code>**tekst**</code> voor <strong>vette tekst</strong></li>
              <li><code>*tekst*</code> voor <em>cursieve tekst</em></li>
              <li><code>[link](URL)</code> voor links</li>
              <li>Gebruik de knoppen voor afbeeldingen en audio</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t mt-8">
        <Button onClick={onCancel} variant="outline">
          <X className="h-4 w-4 mr-2" />
          Annuleren
        </Button>
        <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
          <Save className="h-4 w-4 mr-2" />
          {article ? 'Bijwerken' : 'Opslaan'}
        </Button>
      </div>
    </div>
  );
};

export default SimpleRichEditor;