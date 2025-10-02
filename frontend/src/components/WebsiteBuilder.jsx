import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import PageBuilder from './PageBuilder';
import MenuEditor from './MenuEditor';
import ImageManager from './ImageManager';
import { toast } from 'sonner';
import { 
  Layout,
  Menu,
  Image as ImageIcon,
  Settings,
  Save,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Code,
  Database
} from 'lucide-react';

export default function WebsiteBuilder() {
  const [activeTab, setActiveTab] = useState('page-builder');
  const [currentPage, setCurrentPage] = useState('home');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // useCallback handler to prevent focus issues
  const handleCurrentPageChange = useCallback((e) => {
    setCurrentPage(e.target.value);
  }, []);
  
  // Pages configuration
  const pages = [
    { key: 'home', label: 'Home', url: '/' },
    { key: 'about', label: 'Over Ons', url: '/about' },
    { key: 'shows', label: 'Shows', url: '/shows' },
    { key: 'characters', label: 'Personages', url: '/characters' },
    { key: 'gallery', label: 'Galerij', url: '/gallery' },
    { key: 'news', label: 'Nieuws', url: '/news' },
    { key: 'contact', label: 'Contact', url: '/contact' }
  ];

  // Save all changes
  const saveWebsite = async () => {
    try {
      // Here you would save all changes to backend
      console.log('Saving website...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUnsavedChanges(false);
      toast.success('Website opgeslagen!');
    } catch (error) {
      toast.error('Fout bij opslaan: ' + error.message);
    }
  };

  // Preview website
  const previewWebsite = () => {
    // Open preview in new tab
    window.open('/', '_blank');
    toast.info('Preview geopend in nieuw tabblad');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Main Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Layout size={24} className="text-blue-600" />
            Website Builder
          </h1>
          
          {unsavedChanges && (
            <Badge variant="destructive">Niet opgeslagen wijzigingen</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Pagina:</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              className="p-2 border rounded"
            >
              {pages.map(page => (
                <option key={page.key} value={page.key}>
                  {page.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="h-6 w-px bg-gray-300 mx-2" />
          
          {/* Action Buttons */}
          <Button variant="outline" onClick={previewWebsite}>
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
          
          <Button onClick={saveWebsite}>
            <Save size={16} className="mr-2" />
            Opslaan
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b px-4">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="page-builder" className="flex items-center gap-2">
                <Layout size={16} />
                Page Builder
              </TabsTrigger>
              <TabsTrigger value="menu-editor" className="flex items-center gap-2">
                <Menu size={16} />
                Menu Editor
              </TabsTrigger>
              <TabsTrigger value="image-manager" className="flex items-center gap-2">
                <ImageIcon size={16} />
                Media Library
              </TabsTrigger>
              <TabsTrigger value="site-settings" className="flex items-center gap-2">
                <Settings size={16} />
                Instellingen
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Page Builder */}
            <TabsContent value="page-builder" className="h-full m-0">
              <PageBuilder
                pageKey={currentPage}
                onSave={(pageData) => {
                  console.log('Page saved:', pageData);
                  setUnsavedChanges(true);
                  toast.success(`${pages.find(p => p.key === currentPage)?.label} opgeslagen!`);
                }}
                onPreview={(blocks) => {
                  console.log('Preview blocks:', blocks);
                }}
              />
            </TabsContent>

            {/* Menu Editor */}
            <TabsContent value="menu-editor" className="h-full m-0 overflow-auto">
              <MenuEditor />
            </TabsContent>

            {/* Image Manager */}
            <TabsContent value="image-manager" className="h-full m-0 overflow-auto">
              <ImageManager
                multiSelect={true}
                onSelect={(images) => {
                  console.log('Images selected:', images);
                  toast.success(`${Array.isArray(images) ? images.length : 1} afbeelding(en) geselecteerd`);
                }}
              />
            </TabsContent>

            {/* Site Settings */}
            <TabsContent value="site-settings" className="h-full m-0 overflow-auto">
              <div className="max-w-4xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Settings size={24} />
                  Website Instellingen
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* General Settings */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Globe size={20} />
                        Algemene Instellingen
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Website Titel</label>
                          <input
                            type="text"
                            defaultValue="Sinterklaas Show Website"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Tagline</label>
                          <input
                            type="text"
                            defaultValue="De Magische Sinterklaas Ervaring"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Website URL</label>
                          <input
                            type="url"
                            defaultValue="https://sinterklaasshow.nl"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Contactemail</label>
                          <input
                            type="email"
                            defaultValue="info@sinterklaasshow.nl"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4">SEO Instellingen</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Meta Beschrijving</label>
                          <textarea
                            rows={3}
                            defaultValue="Beleef de magische Sinterklaas show! Professioneel entertainment voor kinderen en families."
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Zoekwoorden</label>
                          <input
                            type="text"
                            defaultValue="sinterklaas, kindershow, entertainment, familie"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="seo-indexing" defaultChecked />
                          <label htmlFor="seo-indexing" className="text-sm">Sta zoekmachine indexering toe</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Design & Appearance */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Palette size={20} />
                        Design & Styling
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Primaire Kleur</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              defaultValue="#d32f2f"
                              className="w-12 h-10 border rounded"
                            />
                            <input
                              type="text"
                              defaultValue="#d32f2f"
                              className="flex-1 p-2 border rounded"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Secundaire Kleur</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              defaultValue="#1976d2"
                              className="w-12 h-10 border rounded"
                            />
                            <input
                              type="text"
                              defaultValue="#1976d2"
                              className="flex-1 p-2 border rounded"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Font Familie</label>
                          <select className="w-full p-2 border rounded">
                            <option>Inter (Standaard)</option>
                            <option>Roboto</option>
                            <option>Open Sans</option>
                            <option>Lato</option>
                            <option>Poppins</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Logo Upload</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <ImageIcon size={32} className="mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">Sleep logo hierheen of klik om te uploaden</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Code size={20} />
                        Geavanceerde Instellingen
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Custom CSS</label>
                          <textarea
                            rows={4}
                            placeholder="/* Voeg hier je custom CSS toe */"
                            className="w-full p-2 border rounded font-mono text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Header Scripts</label>
                          <textarea
                            rows={3}
                            placeholder="<!-- Analytics, fonts, etc. -->"
                            className="w-full p-2 border rounded font-mono text-sm"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="maintenance-mode" />
                          <label htmlFor="maintenance-mode" className="text-sm">Onderhoudsmodus</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="bg-white p-4 rounded-lg border">
                  <Button onClick={saveWebsite} className="w-full">
                    <Save size={16} className="mr-2" />
                    Alle Instellingen Opslaan
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
