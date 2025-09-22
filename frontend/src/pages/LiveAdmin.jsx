import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LiveEditor } from '../components/LiveEditor';
import Home from './Home';
import About from './About';
import Characters from './Characters';
import Shows from './Shows';
import Gallery from './Gallery';
import News from './News';
import Contact from './Contact';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Home as HomeIcon,
  Users,
  Calendar,
  FileText,
  Image as ImageIcon,
  Mail,
  Info,
  LogOut
} from 'lucide-react';

export default function LiveAdmin() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [previewMode, setPreviewMode] = useState('desktop');

  const pages = [
    { key: 'home', name: 'Home', icon: HomeIcon, component: Home },
    { key: 'about', name: 'Over de Show', icon: Info, component: About },
    { key: 'characters', name: 'Karakters', icon: Users, component: Characters },
    { key: 'shows', name: 'Shows', icon: Calendar, component: Shows },
    { key: 'gallery', name: 'Galerij', icon: ImageIcon, component: Gallery },
    { key: 'news', name: 'Nieuws', icon: FileText, component: News },
    { key: 'contact', name: 'Contact', icon: Mail, component: Contact }
  ];

  const getPreviewStyles = () => {
    switch (previewMode) {
      case 'mobile':
        return {
          width: '375px',
          height: '667px',
          margin: '0 auto',
          border: '8px solid #1f2937',
          borderRadius: '25px',
          overflow: 'hidden'
        };
      case 'tablet':
        return {
          width: '768px',
          height: '1024px',
          margin: '0 auto',
          border: '4px solid #374151',
          borderRadius: '15px',
          overflow: 'hidden'
        };
      default:
        return {
          width: '100%',
          height: 'auto',
          border: 'none',
          borderRadius: '0'
        };
    }
  };

  const renderSelectedPage = () => {
    const selectedPageData = pages.find(p => p.key === selectedPage);
    if (!selectedPageData) return null;

    const PageComponent = selectedPageData.component;
    
    // Wrap each page component with LiveEditor
    return (
      <LiveEditor pageKey={selectedPage}>
        <PageComponent />
      </LiveEditor>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🎭 Live Website Editor
              </h1>
              <p className="text-gray-600 text-sm">
                Klik op elementen om ze direct te bewerken - wijzigingen worden automatisch opgeslagen
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Preview Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor size={16} />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet size={16} />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone size={16} />
                </Button>
              </div>
              
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live Editor Actief
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen sticky top-16 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Pagina's</h3>
            <div className="space-y-1">
              {pages.map((page) => (
                <Button
                  key={page.key}
                  variant={selectedPage === page.key ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedPage(page.key)}
                >
                  <page.icon size={16} className="mr-2" />
                  {page.name}
                </Button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-700 mb-3 text-sm">Live Editor Info</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Huidige Pagina:</span>
                  <span className="font-medium">{pages.find(p => p.key === selectedPage)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preview Mode:</span>
                  <span className="font-medium capitalize">{previewMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-save:</span>
                  <span className="font-medium text-green-600">Ingeschakeld</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">📝 Instructies</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• Klik "Bewerken" om edit mode in te schakelen</div>
                <div>• Klik op tekst om direct te bewerken</div>
                <div>• Klik op afbeeldingen om te vervangen</div>
                <div>• Wijzigingen worden automatisch opgeslagen</div>
                <div>• Gebruik Ctrl+S voor handmatig opslaan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Page Preview */}
            <div 
              className="transition-all duration-300"
              style={getPreviewStyles()}
            >
              <div className="h-full overflow-y-auto">
                {renderSelectedPage()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}