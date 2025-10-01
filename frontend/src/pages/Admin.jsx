import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save, 
  Eye, 
  Calendar,
  Image as ImageIcon,
  FileText,
  Settings,
  BarChart,
  LogOut,
  Shield,
  X
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

export default function Admin() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [news, setNews] = useState([]);
  const [shows, setShows] = useState([]);
  const [content, setContent] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [editingShow, setEditingShow] = useState(null);

  // Authentication check
  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Geen Toegang
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Je hebt admin rechten nodig om deze pagina te bekijken.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Login met admin account via de header.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [newsRes, showsRes, contentRes, galleryRes] = await Promise.all([
        fetch(`${API}/admin/news`),
        fetch(`${API}/admin/shows`),
        fetch(`${API}/admin/content`),
        fetch(`${API}/admin/gallery`)
      ]);

      if (newsRes.ok) setNews(await newsRes.json());
      if (showsRes.ok) setShows(await showsRes.json());
      if (contentRes.ok) setContent(await contentRes.json());
      if (galleryRes.ok) setGallery(await galleryRes.json());
    } catch (error) {
      toast.error('Error loading data: ' + error.message);
    }
    setLoading(false);
  };

  // News Management with Grid System
  const NewsManager = () => {
    const [newArticle, setNewArticle] = useState({
      title: '',
      excerpt: '',
      content: '',
      category: 'Algemeen',
      featured_image: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      published: true
    });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // News Categories
    const categories = [
      'Algemeen',
      'Show Nieuws', 
      'Achter de Schermen',
      'Tips & Tricks',
      'Evenementen',
      'Interviews'
    ];

    const handleImageUpload = async (file) => {
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API}/admin/news/upload-image`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNewArticle({...newArticle, featured_image: data.image_url, image: data.image_url});
          toast.success('Afbeelding geüpload!');
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        toast.error('Error uploading image: ' + error.message);
      }
      setUploadingImage(false);
    };

    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        handleImageUpload(file);
      }
    };

    const handleCreateNews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API}/admin/news`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newArticle)
        });

        if (response.ok) {
          toast.success('Artikel aangemaakt!');
          setNewArticle({
            title: '',
            excerpt: '',
            content: '',
            category: 'Algemeen',
            featured_image: '',
            image: '',
            date: new Date().toISOString().split('T')[0],
            published: true
          });
          setSelectedFile(null);
          fetchAllData();
        }
      } catch (error) {
        toast.error('Error creating article: ' + error.message);
      }
    };

    const handleUpdateNews = async (id, updateData) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API}/admin/news/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          toast.success('Artikel bijgewerkt!');
          setEditingNews(null);
          fetchAllData();
        }
      } catch (error) {
        toast.error('Error updating article: ' + error.message);
      }
    };

    const handleDeleteNews = async (id) => {
      if (window.confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API}/admin/news/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            toast.success('Artikel verwijderd!');
            fetchAllData();
          }
        } catch (error) {
          toast.error('Error deleting article: ' + error.message);
        }
      }
    };

    return (
      <div className="space-y-6">
        {/* Create New Article */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              Nieuw Nieuwsartikel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Titel</Label>
                <Input
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                  placeholder="Artikel titel"
                />
              </div>
              <div>
                <Label>Datum</Label>
                <Input
                  type="date"
                  value={newArticle.date}
                  onChange={(e) => setNewArticle({...newArticle, date: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Categorie</Label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Featured Afbeelding</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload size={16} />
                    {uploadingImage ? 'Uploading...' : 'Kies Afbeelding'}
                  </label>
                  {newArticle.featured_image && (
                    <Badge variant="default">Afbeelding geüpload</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <Label>Excerpt (Samenvatting)</Label>
              <Textarea
                value={newArticle.excerpt}
                onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                placeholder="Korte samenvatting van het artikel"
                rows={2}
              />
            </div>
            
            <div>
              <Label>Content</Label>
              <Textarea
                value={newArticle.content}
                onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                placeholder="Volledige artikel inhoud"
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newArticle.published}
                onCheckedChange={(checked) => setNewArticle({...newArticle, published: checked})}
              />
              <Label>Gepubliceerd</Label>
            </div>

            <Button onClick={handleCreateNews} className="w-full">
              <Save className="mr-2" size={16} />
              Artikel Opslaan
            </Button>
          </CardContent>
        </Card>

        {/* News Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Nieuws Artikelen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <div key={article.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Featured Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {article.featured_image || article.image ? (
                      <img
                        src={article.featured_image || article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={article.published ? "default" : "secondary"}>
                        {article.published ? "Live" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.category || 'Algemeen'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(article.date).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingNews(article)}
                        className="flex-1"
                      >
                        <Edit size={14} className="mr-1" />
                        Bewerken
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteNews(article.id)}
                        className="flex-1 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Verwijderen
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {news.length === 0 && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Geen nieuws artikelen</h3>
                <p className="text-gray-500">Maak je eerste nieuwsartikel aan om te beginnen.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        {editingNews && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Artikel Bewerken</h2>
                <button 
                  onClick={() => setEditingNews(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Titel</Label>
                    <Input
                      value={editingNews.title}
                      onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Datum</Label>
                    <Input
                      type="date"
                      value={editingNews.date}
                      onChange={(e) => setEditingNews({...editingNews, date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Categorie</Label>
                  <select
                    value={editingNews.category || 'Algemeen'}
                    onChange={(e) => setEditingNews({...editingNews, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    value={editingNews.excerpt}
                    onChange={(e) => setEditingNews({...editingNews, excerpt: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={editingNews.content}
                    onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                    rows={6}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingNews.published}
                    onCheckedChange={(checked) => setEditingNews({...editingNews, published: checked})}
                  />
                  <Label>Gepubliceerd</Label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setEditingNews(null)}
                    className="flex-1"
                  >
                    Annuleren
                  </Button>
                  <Button
                    onClick={() => handleUpdateNews(editingNews.id, editingNews)}
                    className="flex-1"
                  >
                    <Save size={16} className="mr-2" />
                    Opslaan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Show Management
  const ShowManager = () => {
    const [newShow, setNewShow] = useState({
      date: '',
      time: '',
      venue: '',
      city: '',
      ticketsAvailable: true,
      ticketUrl: ''
    });

    const handleCreateShow = async () => {
      try {
        const response = await fetch(`${API}/admin/shows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newShow)
        });

        if (response.ok) {
          toast.success('Show toegevoegd!');
          setNewShow({
            date: '',
            time: '',
            venue: '',
            city: '',
            ticketsAvailable: true,
            ticketUrl: ''
          });
          fetchAllData();
        }
      } catch (error) {
        toast.error('Error creating show: ' + error.message);
      }
    };

    const handleDeleteShow = async (id) => {
      if (window.confirm('Weet je zeker dat je deze show wilt verwijderen?')) {
        try {
          const response = await fetch(`${API}/admin/shows/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            toast.success('Show verwijderd!');
            fetchAllData();
          }
        } catch (error) {
          toast.error('Error deleting show: ' + error.message);
        }
      }
    };

    return (
      <div className="space-y-6">
        {/* Add New Show */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Nieuwe Show
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Datum</Label>
                <Input
                  type="date"
                  value={newShow.date}
                  onChange={(e) => setNewShow({...newShow, date: e.target.value})}
                />
              </div>
              <div>
                <Label>Tijd</Label>
                <Input
                  value={newShow.time}
                  onChange={(e) => setNewShow({...newShow, time: e.target.value})}
                  placeholder="14:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Venue</Label>
                <Input
                  value={newShow.venue}
                  onChange={(e) => setNewShow({...newShow, venue: e.target.value})}
                  placeholder="Theater naam"
                />
              </div>
              <div>
                <Label>Stad</Label>
                <Input
                  value={newShow.city}
                  onChange={(e) => setNewShow({...newShow, city: e.target.value})}
                  placeholder="Amsterdam"
                />
              </div>
            </div>

            <div>
              <Label>Ticket URL</Label>
              <Input
                value={newShow.ticketUrl}
                onChange={(e) => setNewShow({...newShow, ticketUrl: e.target.value})}
                placeholder="https://tickets.com/..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newShow.ticketsAvailable}
                onCheckedChange={(checked) => setNewShow({...newShow, ticketsAvailable: checked})}
              />
              <Label>Tickets Beschikbaar</Label>
            </div>

            <Button onClick={handleCreateShow} className="w-full">
              <Save className="mr-2" size={16} />
              Show Opslaan
            </Button>
          </CardContent>
        </Card>

        {/* Existing Shows */}
        <div className="grid grid-cols-1 gap-4">
          {shows.map((show) => (
            <Card key={show.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{show.venue}, {show.city}</h3>
                      <Badge variant={show.ticketsAvailable ? "default" : "secondary"}>
                        {show.ticketsAvailable ? "Beschikbaar" : "Uitverkocht"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>📅 {show.date} om {show.time}</div>
                      <div>🎟️ <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Tickets</a></div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteShow(show.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Content Management
  const ContentManager = () => {
    const [contentItems, setContentItems] = useState([
      { id: 'hero_title', label: 'Hero Titel', value: 'De Magische Sinterklaas Show in Genk', type: 'text' },
      { id: 'hero_subtitle', label: 'Hero Subtitel', value: 'Beleef samen met je kinderen de meest interactieve en magische Sinterklaasshow van België.', type: 'textarea' },
      { id: 'about_title', label: 'Over Ons Titel', value: 'Wat maakt onze show zo speciaal?', type: 'text' },
      { id: 'phone', label: 'Telefoonnummer', value: '+32 (0)89 123 456', type: 'text' },
      { id: 'email', label: 'Email', value: 'info@sinterklaasgenk.be', type: 'email' },
      { id: 'address', label: 'Adres', value: 'Cultureel Centrum Genk\nDieplaan 17, 3600 Genk', type: 'textarea' },
    ]);

    const handleUpdateContent = async (id, value) => {
      try {
        const response = await fetch(`${API}/admin/content/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
        });

        if (response.ok) {
          setContentItems(contentItems.map(item => 
            item.id === id ? { ...item, value } : item
          ));
          toast.success('Content bijgewerkt!');
        }
      } catch (error) {
        toast.error('Error updating content: ' + error.message);
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Website Content Beheer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {contentItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <Label htmlFor={item.id}>{item.label}</Label>
                {item.type === 'textarea' ? (
                  <Textarea
                    id={item.id}
                    value={item.value}
                    onChange={(e) => setContentItems(contentItems.map(ci => 
                      ci.id === item.id ? { ...ci, value: e.target.value } : ci
                    ))}
                    onBlur={(e) => handleUpdateContent(item.id, e.target.value)}
                    rows={item.id === 'address' ? 3 : 2}
                  />
                ) : (
                  <Input
                    id={item.id}
                    type={item.type}
                    value={item.value}
                    onChange={(e) => setContentItems(contentItems.map(ci => 
                      ci.id === item.id ? { ...ci, value: e.target.value } : ci
                    ))}
                    onBlur={(e) => handleUpdateContent(item.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };
  // Dashboard Overview
  const Dashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welkom terug, {user?.email}!
              </h2>
              <p className="text-gray-600">Beheer de Sinterklaas Genk website</p>
            </div>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2">
              <LogOut size={16} />
              Uitloggen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nieuws Artikelen</p>
                <p className="text-3xl font-bold">{news.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shows</p>
                <p className="text-3xl font-bold">{shows.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Galerij Items</p>
                <p className="text-3xl font-bold">{gallery.length}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Items</p>
                <p className="text-3xl font-bold">{content.length}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎭</div>
          <div>Admin panel laden...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎭 Sinterklaas Show Admin</h1>
          <p className="text-gray-600">Beheer de website content eenvoudig</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText size={16} />
              Nieuws
            </TabsTrigger>
            <TabsTrigger value="shows" className="flex items-center gap-2">
              <Calendar size={16} />
              Shows
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Settings size={16} />
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="shows">
            <ShowManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}