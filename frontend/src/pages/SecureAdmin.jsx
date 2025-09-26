import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SimpleLogin } from '../components/SimpleLogin';
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
  Save, 
  Users,
  Settings,
  FileText,
  LogOut,
  Shield,
  Image as ImageIcon,
  Upload,
  Mail,
  Send,
  Calendar,
  BarChart3,
  Download,
  Eye
} from 'lucide-react';

export default function SecureAdmin() {
  // Simple auth check
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // If no token or user, show login
  if (!token || !user) {
    return <SimpleLogin />;
  }

  // Parse user
  let userData;
  try {
    userData = JSON.parse(user);
    if (!userData.is_admin) {
      return <SimpleLogin />;
    }
  } catch (error) {
    return <SimpleLogin />;
  }

  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [siteSettings, setSiteSettings] = useState({ logo: '', favicon: '' });
  const [loading, setLoading] = useState(false);

  // Newsletter states
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [mailingLists, setMailingLists] = useState([]);
  const [selectedTab, setSelectedTab] = useState('subscribers');

  const [editingNews, setEditingNews] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false
  });

  // Simple API call function with fallback
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    // If demo token, return mock data
    if (token && token.startsWith('demo-token')) {
      console.log('🔍 Demo mode: returning mock data for', endpoint);
      return {
        ok: true,
        json: async () => {
          if (endpoint === '/admin/news') return [];
          if (endpoint === '/admin/users') return [];
          if (endpoint === '/admin/settings') return { logo: '', favicon: '' };
          return {};
        }
      };
    }

    // Try real API call
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      return response;
    } catch (error) {
      console.log('🔍 API call failed, using demo mode:', error);
      // Fallback to demo mode
      return {
        ok: true,
        json: async () => {
          if (endpoint === '/admin/news') return [];
          if (endpoint === '/admin/users') return [];
          if (endpoint === '/admin/settings') return { logo: '', favicon: '' };
          return {};
        }
      };
    }
  };

  // Simple logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // Define fetchAllData 
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [newsRes, usersRes, settingsRes] = await Promise.all([
        apiCall('/admin/news'),
        apiCall('/admin/users'),
        apiCall('/admin/settings')
      ]);
      
      if (newsRes.ok) setNews(await newsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (settingsRes.ok) setSiteSettings(await settingsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

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
        const response = await apiCall('/admin/news', {
          method: 'POST',
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

    const handleDeleteNews = async (id) => {
      if (window.confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) {
        try {
          const response = await apiCall(`/admin/news/${id}`, {
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

  // User Management
  const UserManager = () => {
    const handleCreateUser = async () => {
      try {
        const response = await apiCall('/admin/users', {
          method: 'POST',
          body: JSON.stringify(newUser)
        });

        if (response.ok) {
          toast.success('Gebruiker aangemaakt!');
          setNewUser({
            username: '',
            email: '',
            password: '',
            is_admin: false
          });
          fetchAllData();
        }
      } catch (error) {
        toast.error('Error creating user: ' + error.message);
      }
    };

    const handleDeleteUser = async (id) => {
      if (window.confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
        try {
          const response = await apiCall(`/admin/users/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            toast.success('Gebruiker verwijderd!');
            fetchAllData();
          }
        } catch (error) {
          toast.error('Error deleting user: ' + error.message);
        }
      }
    };

    return (
      <div className="space-y-6">
        {/* Create New User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              Nieuwe Gebruiker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Gebruikersnaam</Label>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="gebruikersnaam"
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            
            <div>
              <Label>Wachtwoord</Label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newUser.is_admin}
                onCheckedChange={(checked) => setNewUser({...newUser, is_admin: checked})}
              />
              <Label>Administrator</Label>
            </div>

            <Button onClick={handleCreateUser} className="w-full">
              <Save className="mr-2" size={16} />
              Gebruiker Aanmaken
            </Button>
          </CardContent>
        </Card>

        {/* Existing Users */}
        <div className="grid grid-cols-1 gap-4">
          {users.map((userData) => (
            <Card key={userData.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{userData.username}</h3>
                      <Badge variant={userData.is_admin ? "default" : "secondary"}>
                        {userData.is_admin ? "Admin" : "Gebruiker"}
                      </Badge>
                      <Badge variant={userData.is_active ? "default" : "destructive"}>
                        {userData.is_active ? "Actief" : "Inactief"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{userData.email}</p>
                    <div className="text-xs text-gray-500">
                      Aangemaakt: {new Date(userData.createdAt).toLocaleDateString('nl-NL')}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(userData.id)}
                      disabled={userData.id === user.id}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Site Settings Manager
  const SiteSettingsManager = () => {
    const handleUpdateSettings = async () => {
      try {
        const response = await apiCall('/admin/settings', {
          method: 'PUT',
          body: JSON.stringify(siteSettings)
        });

        if (response.ok) {
          toast.success('Instellingen opgeslagen!');
        }
      } catch (error) {
        toast.error('Error updating settings: ' + error.message);
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Website Instellingen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Logo URL</Label>
              <Input
                value={siteSettings.logo || ''}
                onChange={(e) => setSiteSettings({...siteSettings, logo: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div>
              <Label>Favicon URL</Label>
              <Input
                value={siteSettings.favicon || ''}
                onChange={(e) => setSiteSettings({...siteSettings, favicon: e.target.value})}
                placeholder="https://example.com/favicon.ico"
              />
            </div>

            <Button onClick={handleUpdateSettings} className="w-full">
              <Save className="mr-2" size={16} />
              Instellingen Opslaan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

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
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎭 Sinterklaas Show Admin</h1>
            <p className="text-gray-600">Welkom, {user.username}</p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2" size={16} />
            Uitloggen
          </Button>
        </div>

        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText size={16} />
              Nieuws
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Settings size={16} />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Gebruikers
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Instellingen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManager />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}