import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { BannerEditor } from '../components/BannerEditor';
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
  BarChart
} from 'lucide-react';

const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:8001' : process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Admin() {
  const [news, setNews] = useState([]);
  const [shows, setShows] = useState([]);
  const [content, setContent] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [editingShow, setEditingShow] = useState(null);

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

  // News Management
  const NewsManager = () => {
    const [newArticle, setNewArticle] = useState({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      published: true
    });

    const handleCreateNews = async () => {
      try {
        const response = await fetch(`${API}/admin/news`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newArticle)
        });

        if (response.ok) {
          toast.success('Artikel aangemaakt!');
          setNewArticle({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            date: new Date().toISOString().split('T')[0],
            published: true
          });
          fetchAllData();
        }
      } catch (error) {
        toast.error('Error creating article: ' + error.message);
      }
    };

    const handleUpdateNews = async (id, updateData) => {
      try {
        const response = await fetch(`${API}/admin/news/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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
          const response = await fetch(`${API}/admin/news/${id}`, {
            method: 'DELETE'
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
              Nieuw Artikel
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
                rows={4}
              />
            </div>
            
            <div>
              <Label>Afbeelding URL</Label>
              <Input
                value={newArticle.image}
                onChange={(e) => setNewArticle({...newArticle, image: e.target.value})}
                placeholder="https://..."
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

        {/* Existing Articles */}
        <div className="grid grid-cols-1 gap-4">
          {news.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{article.title}</h3>
                      <Badge variant={article.published ? "default" : "secondary"}>
                        {article.published ? "Live" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(article.date).toLocaleDateString('nl-NL')}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingNews(article)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteNews(article.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                {article.image && (
                  <div className="mt-3">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
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

  // Dashboard Overview
  const Dashboard = () => (
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
            <BannerEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}