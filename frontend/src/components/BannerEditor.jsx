import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Upload, Save, Eye, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:8001' : process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const BannerEditor = () => {
  const [bannerData, setBannerData] = useState({
    title: 'De Magische Sinterklaas Show',
    subtitle: 'Een onvergetelijke ervaring voor het hele gezin',
    description: 'Beleef de meest magische Sinterklaas show van het jaar! Vol surprises, liedjes en natuurlijk Sinterklaas en zijn trouwe helpers.',
    backgroundImage: 'https://images.unsplash.com/photo-1665844190962-13faad0e8d8e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxzaW50ZXJrbGFhc3xlbnwwfHx8fDE3NTg1Njk5MDF8MA&ixlib=rb-4.1.0&q=85'
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API}/admin/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setBannerData(prev => ({
          ...prev,
          backgroundImage: `${BACKEND_URL}${result.url}`
        }));
        toast.success('Afbeelding geüpload!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('Error uploading image: ' + error.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    try {
      const contentUpdates = [
        {
          section: 'hero',
          type: 'text',
          key: 'title',
          value: bannerData.title
        },
        {
          section: 'hero',
          type: 'text',
          key: 'subtitle',
          value: bannerData.subtitle
        },
        {
          section: 'hero',
          type: 'text',
          key: 'description',
          value: bannerData.description
        },
        {
          section: 'hero',
          type: 'image',
          key: 'background_image',
          value: bannerData.backgroundImage
        }
      ];

      const response = await fetch(`${API}/admin/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentUpdates)
      });

      if (response.ok) {
        toast.success('Banner bijgewerkt! Ververs de homepage om de wijzigingen te zien.');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      toast.error('Error saving banner: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} />
            Banner Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
            <img
              src={bannerData.backgroundImage}
              alt="Banner preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <div className="text-2xl mb-2">🎭✨</div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                  {bannerData.title}
                </h1>
                <p className="text-lg md:text-xl mb-2">
                  {bannerData.subtitle}
                </p>
                <p className="text-sm md:text-base opacity-90">
                  {bannerData.description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon size={20} />
            Banner Bewerken
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Titel</Label>
            <Input
              value={bannerData.title}
              onChange={(e) => setBannerData(prev => ({...prev, title: e.target.value}))}
              placeholder="Hoofdtitel"
            />
          </div>

          <div>
            <Label>Ondertitel</Label>
            <Input
              value={bannerData.subtitle}
              onChange={(e) => setBannerData(prev => ({...prev, subtitle: e.target.value}))}
              placeholder="Ondertitel"
            />
          </div>

          <div>
            <Label>Beschrijving</Label>
            <Textarea
              value={bannerData.description}
              onChange={(e) => setBannerData(prev => ({...prev, description: e.target.value}))}
              placeholder="Banner beschrijving"
              rows={3}
            />
          </div>

          <div>
            <Label>Achtergrond Afbeelding</Label>
            <div className="flex gap-2">
              <Input
                value={bannerData.backgroundImage}
                onChange={(e) => setBannerData(prev => ({...prev, backgroundImage: e.target.value}))}
                placeholder="https://..."
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2" size={16} />
            Banner Opslaan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};