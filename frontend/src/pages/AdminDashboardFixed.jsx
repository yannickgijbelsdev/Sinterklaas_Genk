import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import AdminLogin from '../components/AdminLogin';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye, 
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Users,
  Image as ImageIcon,
  Home,
  Bell,
  Search,
  Filter,
  LogOut,
  UserPlus
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

// Dashboard Overview Component - Outside main component to prevent re-rendering
const DashboardOverview = React.memo(({ stats, news, setActiveTab }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nieuws Artikels</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNews}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shows</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalShows}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Website Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bezoekers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Recent Nieuws
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.slice(0, 5).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{article.title}</p>
                  <p className="text-xs text-gray-500">{article.category}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(article.date).toLocaleDateString('nl-NL')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              onClick={() => setActiveTab('news')} 
              className="w-full justify-start"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nieuw Artikel Toevoegen
            </Button>
            <Button 
              onClick={() => setActiveTab('shows')} 
              className="w-full justify-start"
              variant="outline"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Shows Beheren
            </Button>
            <Button 
              className="w-full justify-start"
              variant="outline"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Media Uploaden
            </Button>
            <Button 
              className="w-full justify-start"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Website Instellingen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
));

// News Management Component - Outside main component
const NewsManagement = React.memo(({ 
  news, 
  editingNews, 
  newNews, 
  setNewNews,
  handleCreateNews,
  handleUpdateNews,
  handleEditNews,
  handleDeleteNews,
  setEditingNews,
  handleImageUpload,
  uploadingImage
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Nieuws Beheer</h2>
      <div className="flex space-x-2">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input placeholder="Zoeken..." className="pl-9 w-64" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>

    {/* Add/Edit Article Form */}
    <Card>
      <CardHeader>
        <CardTitle>
          {editingNews ? `Artikel Bewerken: ${editingNews.title}` : 'Nieuw Artikel Toevoegen'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={newNews.title}
              onChange={(e) => setNewNews(prev => ({...prev, title: e.target.value}))}
              placeholder="Artikel titel..."
            />
          </div>
          <div>
            <Label htmlFor="category">Categorie</Label>
            <select
              id="category"
              value={newNews.category}
              onChange={(e) => setNewNews(prev => ({...prev, category: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Algemeen">Algemeen</option>
              <option value="Tips & Tricks">Tips & Tricks</option>
              <option value="Achter de Schermen">Achter de Schermen</option>
              <option value="Show Nieuws">Show Nieuws</option>
            </select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="excerpt">Samenvatting</Label>
          <Textarea
            id="excerpt"
            value={newNews.excerpt}
            onChange={(e) => setNewNews(prev => ({...prev, excerpt: e.target.value}))}
            placeholder="Korte samenvatting..."
            rows={2}
          />
        </div>
        
        <div>
          <Label htmlFor="content">Inhoud</Label>
          <Textarea
            id="content"
            value={newNews.content}
            onChange={(e) => setNewNews(prev => ({...prev, content: e.target.value}))}
            placeholder="Volledige artikel inhoud..."
            rows={6}
          />
        </div>
        
        {/* Featured Image Upload */}
        <div>
          <Label htmlFor="featured-image">Featured Image</Label>
          <div className="space-y-2">
            <input
              id="featured-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            {uploadingImage && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            )}
            {newNews.featured_image && (
              <div className="mt-2">
                <img 
                  src={newNews.featured_image} 
                  alt="Preview" 
                  className="w-32 h-20 object-cover rounded-lg border"
                />
                <p className="text-xs text-gray-500 mt-1">Featured image preview</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={editingNews ? handleUpdateNews : handleCreateNews} 
            disabled={!newNews.title || !newNews.content}
          >
            {editingNews ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Artikel Bijwerken
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Artikel Toevoegen
              </>
            )}
          </Button>
          {editingNews && (
            <Button 
              variant="outline" 
              onClick={() => {
                setEditingNews(null);
                setNewNews({
                  title: '',
                  excerpt: '',
                  content: '',
                  category: 'Algemeen',
                  published: true
                });
              }}
            >
              Annuleren
            </Button>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Articles List */}
    <Card>
      <CardHeader>
        <CardTitle>Bestaande Artikels ({news.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((article) => (
            <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium">{article.title}</h3>
                  <Badge variant="outline">{article.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{article.excerpt}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(article.date).toLocaleDateString('nl-NL')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditNews(article)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteNews(article.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
));

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [news, setNews] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newNews, setNewNews] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Algemeen',
    published: true,
    featured_image: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [stats, setStats] = useState({
    totalNews: 0,
    totalShows: 0,
    totalViews: 1234,
    totalUsers: 89
  });

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = sessionStorage.getItem('adminAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [newsRes, showsRes] = await Promise.all([
        fetch(`${API}/news`),
        fetch(`${API}/admin/shows`)
      ]);

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData);
        setStats(prev => ({ ...prev, totalNews: newsData.length }));
      }

      if (showsRes.ok) {
        const showsData = await showsRes.json();
        setShows(showsData);
        setStats(prev => ({ ...prev, totalShows: showsData.length }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Fout bij laden van data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    toast.info('Uitgelogd');
  }, []);

  const handleCreateNews = useCallback(async () => {
    try {
      const response = await fetch(`${API}/demo/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newNews,
          date: new Date().toISOString(),
          featured_image: `https://via.placeholder.com/400x200/DC2626/FFFFFF?text=${encodeURIComponent(newNews.title.substring(0, 20))}`
        })
      });

      if (response.ok) {
        toast.success('Nieuws artikel toegevoegd!');
        setNewNews({
          title: '',
          excerpt: '',
          content: '',
          category: 'Algemeen',
          published: true
        });
        loadDashboardData();
      } else {
        const errorData = await response.json();
        toast.error(`Fout bij toevoegen artikel: ${errorData.detail || 'Onbekende fout'}`);
      }
    } catch (error) {
      console.error('Error creating news:', error);
      toast.error('Verbindingsfout');
    }
  }, [newNews, loadDashboardData]);

  const handleUpdateNews = useCallback(async () => {
    if (!editingNews) return;

    try {
      const response = await fetch(`${API}/demo/news/${editingNews.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNews)
      });

      if (response.ok) {
        toast.success('Artikel bijgewerkt!');
        setEditingNews(null);
        setNewNews({
          title: '',
          excerpt: '',
          content: '',
          category: 'Algemeen',
          published: true
        });
        loadDashboardData();
      } else {
        const errorData = await response.json();
        toast.error(`Fout bij bijwerken artikel: ${errorData.detail || 'Onbekende fout'}`);
      }
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Verbindingsfout');
    }
  }, [editingNews, newNews, loadDashboardData]);

  const handleDeleteNews = useCallback(async (id) => {
    if (!window.confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return;

    try {
      const response = await fetch(`${API}/demo/news/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Artikel verwijderd');
        loadDashboardData();
      } else {
        const errorData = await response.json();
        toast.error(`Fout bij verwijderen: ${errorData.detail || 'Onbekende fout'}`);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Verbindingsfout');
    }
  }, [loadDashboardData]);

  const handleEditNews = useCallback((article) => {
    setEditingNews(article);
    setNewNews({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      published: article.published || true
    });
  }, []);

  const handleCreateUser = useCallback(async () => {
    try {
      const response = await fetch(`${API}/demo/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        toast.success('Gebruiker aangemaakt!');
        setNewUser({
          email: '',
          password: '',
          role: 'admin'
        });
      } else {
        const errorData = await response.json();
        toast.error(`Fout bij aanmaken gebruiker: ${errorData.detail || 'Onbekende fout'}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Verbindingsfout');
    }
  }, [newUser]);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Alleen afbeeldingen zijn toegestaan');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Bestand te groot. Maximum 5MB toegestaan');
      return;
    }

    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API}/demo/news/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setNewNews(prev => ({
          ...prev,
          featured_image: data.image_url
        }));
        toast.success('Afbeelding succesvol geüpload!');
      } else {
        const errorData = await response.json();
        toast.error(`Upload gefaald: ${errorData.detail || 'Onbekende fout'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Verbindingsfout tijdens upload');
    } finally {
      setUploadingImage(false);
    }
  }, []);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-red-600">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-red-100 text-red-700 border-r-4 border-red-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('news')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'news' 
                  ? 'bg-red-100 text-red-700 border-r-4 border-red-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5 mr-3" />
              Nieuws
              <Badge className="ml-auto">{news.length}</Badge>
            </button>
          </div>
        </nav>
        
        {/* Bottom Links */}
        <div className="absolute bottom-0 w-full p-4 space-y-2">
          <a href="/" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <Home className="h-4 w-4 mr-2" />
            Terug naar Website
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Uitloggen
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'dashboard' && 'Dashboard Overzicht'}
                {activeTab === 'news' && 'Nieuws Beheer'}
              </h2>
              <p className="text-sm text-gray-600">
                Sinterklaas Genk - Administratie Paneel
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-red-700">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}
          
          {!loading && (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview 
                  stats={stats} 
                  news={news} 
                  setActiveTab={setActiveTab} 
                />
              )}
              {activeTab === 'news' && (
                <NewsManagement
                  news={news}
                  editingNews={editingNews}
                  newNews={newNews}
                  setNewNews={setNewNews}
                  handleCreateNews={handleCreateNews}
                  handleUpdateNews={handleUpdateNews}
                  handleEditNews={handleEditNews}
                  handleDeleteNews={handleDeleteNews}
                  setEditingNews={setEditingNews}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}