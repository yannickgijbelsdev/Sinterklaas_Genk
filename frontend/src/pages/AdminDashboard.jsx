import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import AdminLogin from '../components/AdminLogin';
import { useAuth } from '../contexts/AuthContext';
import SimpleRichEditor from '../components/SimpleRichEditor';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye, 
  FileText,
  BarChart3,
  Users,
  Home,
  Bell,
  Search,
  Filter,
  LogOut,
  UserPlus,
  Lock,
  Key,
  Shield
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

// Component definitions outside main component to prevent re-rendering issues
const DashboardOverview = ({ stats, news, setActiveTab }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
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

      {/* Website Views card removed */}

      {/* Bezoekers card removed */}
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Nieuws section removed - already in menu */}

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
              onClick={() => setActiveTab('users')} 
              className="w-full justify-start"
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Gebruiker Toevoegen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, logout, apiCall, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [news, setNews] = useState([]);
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showRichEditor, setShowRichEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [passwordChange, setPasswordChange] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalNews: 0
  });

  // useCallback handlers to prevent input focus issues
  const handlePasswordCurrentChange = useCallback((e) => {
    setPasswordChange(prev => ({
      ...prev, 
      current_password: e.target.value
    }));
  }, []);

  const handlePasswordNewChange = useCallback((e) => {
    setPasswordChange(prev => ({
      ...prev, 
      new_password: e.target.value
    }));
  }, []);

  const handlePasswordConfirmChange = useCallback((e) => {
    setPasswordChange(prev => ({
      ...prev, 
      confirm_password: e.target.value
    }));
  }, []);

  const handleNewUserEmailChange = useCallback((e) => {
    setNewUser(prev => ({...prev, email: e.target.value}));
  }, []);

  const handleNewUserPasswordChange = useCallback((e) => {
    setNewUser(prev => ({...prev, password: e.target.value}));
  }, []);

  const handleNewUserRoleChange = useCallback((e) => {
    setNewUser(prev => ({...prev, role: e.target.value}));
  }, []);

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      loadDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

  const handleLogout = () => {
    logout();
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiCall('/admin/news/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type, let browser set it for FormData
        }
      });

      if (response.ok) {
        const result = await response.json();
        // Return full URL for proper image serving
        return result.image_url.startsWith('/') 
          ? `${process.env.REACT_APP_BACKEND_URL}${result.image_url}`
          : result.image_url;
      } else {
        toast.error('Fout bij uploaden van afbeelding');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Verbindingsfout bij uploaden');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Optimized onChange handlers to prevent re-renders
  const handleTitleChange = useCallback((e) => {
    setNewNews(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleExcerptChange = useCallback((e) => {
    setNewNews(prev => ({ ...prev, excerpt: e.target.value }));
  }, []);

  const handleContentChange = useCallback((e) => {
    setNewNews(prev => ({ ...prev, content: e.target.value }));
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setNewNews(prev => ({ ...prev, category: e.target.value }));
  }, []);

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const newsRes = await apiCall('/admin/news');

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData);
        setStats(prev => ({ ...prev, totalNews: newsData.length }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Fout bij laden van data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = async () => {
    setEditingArticle(null);
    setShowRichEditor(true);
  };

  const handleSaveNewsFromEditor = async (newsData) => {
    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const endpoint = editingArticle ? `/admin/news/${editingArticle.id}` : '/admin/news';

      const response = await apiCall(endpoint, {
        method: method,
        body: JSON.stringify({
          ...newsData,
          date: editingArticle?.date || new Date().toISOString()
        })
      });

      if (response.ok) {
        toast.success(editingArticle ? 'Artikel bijgewerkt!' : 'Nieuws artikel toegevoegd!');
        setShowRichEditor(false);
        setEditingArticle(null);
        loadDashboardData();
      } else {
        toast.error('Fout bij opslaan artikel');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Verbindingsfout');
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return;

    try {
      const response = await apiCall(`/admin/news/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Artikel verwijderd');
        loadDashboardData();
      } else {
        toast.error('Fout bij verwijderen');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Verbindingsfout');
    }
  };

  const handleEditNews = (article) => {
    setEditingArticle(article);
    setShowRichEditor(true);
  };

  const handleUpdateNews = async () => {
    if (!editingNews) return;

    try {
      let imageUrl = newNews.featured_image;
      
      // Upload new image if selected
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
        if (!imageUrl) {
          toast.error('Fout bij uploaden van nieuwe afbeelding');
          return;
        }
      }

      const response = await apiCall(`/admin/news/${editingNews.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...newNews,
          featured_image: imageUrl
        })
      });

      if (response.ok) {
        toast.success('Artikel bijgewerkt!');
        setEditingNews(null);
        setNewNews({
          title: '',
          excerpt: '',
          content: '',
          category: 'Algemeen',
          published: true,
          featured_image: ''
        });
        setSelectedImage(null);
        setImagePreview('');
        loadDashboardData();
      } else {
        toast.error('Fout bij bijwerken artikel');
      }
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Verbindingsfout');
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${API}/admin/users`, {
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
        toast.error('Fout bij aanmaken gebruiker');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Verbindingsfout');
    }
  };

  const handleChangePassword = async () => {
    if (passwordChange.new_password !== passwordChange.confirm_password) {
      toast.error('Nieuwe wachtwoorden komen niet overeen');
      return;
    }

    if (passwordChange.new_password.length < 6) {
      toast.error('Nieuw wachtwoord moet minimaal 6 karakters lang zijn');
      return;
    }

    try {
      const response = await apiCall('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordChange.current_password,
          new_password: passwordChange.new_password
        })
      });

      if (response.ok) {
        toast.success('Wachtwoord succesvol gewijzigd!');
        setPasswordChange({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Fout bij wijzigen wachtwoord');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Verbindingsfout');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiCall('/admin/users');
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleResetUserPassword = async (userId, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Wachtwoord moet minimaal 6 karakters lang zijn');
      return;
    }

    try {
      const response = await apiCall(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
          password: newPassword
        })
      });

      if (response.ok) {
        toast.success('Gebruiker wachtwoord succesvol gewijzigd!');
        loadUsers(); // Refresh users list
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Fout bij wijzigen gebruiker wachtwoord');
      }
    } catch (error) {
      console.error('Error changing user password:', error);
      toast.error('Verbindingsfout');
    }
  };

// Duplicate code removed - DashboardOverview component is properly defined above

const NewsManagement = ({ 
  news, 
  editingNews, 
  setEditingNews, 
  newNews, 
  setNewNews, 
  handleCreateNews, 
  handleUpdateNews, 
  handleDeleteNews, 
  loading 
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

      {/* Rich News Editor or Simple Button */}
      {showRichEditor ? (
        <SimpleRichEditor
          article={editingArticle}
          onSave={handleSaveNewsFromEditor}
          onCancel={() => {
            setShowRichEditor(false);
            setEditingArticle(null);
          }}
        />
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Button 
                onClick={handleCreateNews}
                className="bg-red-600 hover:bg-red-700"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nieuw Artikel Maken
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Articles Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Bestaande Artikels ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {news.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Geen artikels gevonden
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <div key={article.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Feature Image */}
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {article.featured_image || article.image ? (
                      <img
                        src={(() => {
                          const imgUrl = article.featured_image || article.image;
                          return imgUrl.startsWith('/') 
                            ? `${process.env.REACT_APP_BACKEND_URL}${imgUrl}`
                            : imgUrl;
                        })()}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <div className="text-4xl text-red-300">📰</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {article.category || 'Algemeen'}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(article.date).toLocaleDateString('nl-BE', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          timeZone: 'Europe/Brussels'
                        })}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditNews(article)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Bewerken
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteNews(article.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

// PasswordManagement component merged into UserManagement

  const UserManagement = ({ 
    newUser, 
    setNewUser, 
    handleCreateUser,
    passwordChange, 
    setPasswordChange, 
    handleChangePassword, 
    users, 
    loadUsers, 
    handleResetUserPassword,
    user 
  }) => {
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [newUserPassword, setNewUserPassword] = React.useState('');

    const handleNewUserPasswordChange = React.useCallback((e) => {
      setNewUserPassword(e.target.value);
    }, []);

    React.useEffect(() => {
      loadUsers();
    }, []);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Gebruikers Beheer</h2>
        
        {/* Add New User Form */}
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe Gebruiker Toevoegen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={handleNewUserEmailChange}
                  placeholder="gebruiker@example.com"
                />
              </div>
              <div>
                <Label htmlFor="userPassword">Wachtwoord</Label>
                <Input
                  id="userPassword"
                  type="password"
                  value={newUser.password}
                  onChange={handleNewUserPasswordChange}
                  placeholder="Veilig wachtwoord..."
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="userRole">Rol</Label>
              <select
                id="userRole"
                value={newUser.role}
                onChange={handleNewUserRoleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            
            <Button 
              onClick={handleCreateUser} 
              disabled={!newUser.email || !newUser.password}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Gebruiker Toevoegen
            </Button>
          </CardContent>
        </Card>

        {/* Change Own Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Eigen Wachtwoord Wijzigen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current_password">Huidig Wachtwoord</Label>
              <Input
                id="current_password"
                type="password"
                value={passwordChange.current_password}
                onChange={handlePasswordCurrentChange}
                placeholder="Voer huidig wachtwoord in"
              />
            </div>
            <div>
              <Label htmlFor="new_password">Nieuw Wachtwoord</Label>
              <Input
                id="new_password"
                type="password"
                value={passwordChange.new_password}
                onChange={handlePasswordNewChange}
                placeholder="Voer nieuw wachtwoord in (min. 6 karakters)"
              />
            </div>
            <div>
              <Label htmlFor="confirm_password">Bevestig Nieuw Wachtwoord</Label>
              <Input
                id="confirm_password"
                type="password"
                value={passwordChange.confirm_password}
                onChange={handlePasswordConfirmChange}
                placeholder="Bevestig nieuw wachtwoord"
              />
            </div>
            <Button onClick={handleChangePassword} className="bg-red-600 hover:bg-red-700">
              <Lock className="h-4 w-4 mr-2" />
              Wachtwoord Wijzigen
            </Button>
          </CardContent>
        </Card>

        {/* Reset Other Users' Passwords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Gebruikers Wachtwoorden Beheren
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length > 0 ? (
                <div className="space-y-3">
                  {users.filter(u => u.id !== user?.id).map((userItem) => (
                    <div key={userItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{userItem.username}</p>
                        <p className="text-sm text-gray-500">{userItem.email}</p>
                        <Badge variant={userItem.is_admin ? "default" : "secondary"} className="text-xs mt-1">
                          {userItem.is_admin ? 'Admin' : 'Gebruiker'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedUser === userItem.id ? (
                          <>
                            <Input
                              type="password"
                              placeholder="Nieuw wachtwoord (min. 6 karakters)"
                              value={newUserPassword}
                              onChange={handleNewUserPasswordChange}
                              className="w-48"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => {
                                handleResetUserPassword(userItem.id, newUserPassword);
                                setSelectedUser(null);
                                setNewUserPassword('');
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Opslaan
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(null);
                                setNewUserPassword('');
                              }}
                            >
                              Annuleren
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedUser(userItem.id)}
                          >
                            <Key className="h-4 w-4 mr-1" />
                            Reset Wachtwoord
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Geen andere gebruikers gevonden</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Show login screen if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎅</div>
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !isAdmin()) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-white border-b border-gray-200">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <img 
              src="https://customer-assets.emergentagent.com/job_genk-sint-site/artifacts/ij49qgko_cropped-Favicon_Sinterklaas.png"
              alt="Sinterklaas Admin Logo"
              className="h-10 w-auto"
            />
          </div>
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
            
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'users' 
                  ? 'bg-red-100 text-red-700 border-r-4 border-red-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Gebruikers
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
                {activeTab === 'users' && 'Gebruikers Beheer'}
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
                  setEditingNews={setEditingNews}
                  newNews={newNews}
                  setNewNews={setNewNews}
                  handleCreateNews={handleCreateNews}
                  handleUpdateNews={handleUpdateNews}
                  handleDeleteNews={handleDeleteNews}
                  loading={loading}
                />
              )}
              {activeTab === 'users' && (
                <UserManagement 
                  newUser={newUser} 
                  setNewUser={setNewUser} 
                  handleCreateUser={handleCreateUser}
                  passwordChange={passwordChange}
                  setPasswordChange={setPasswordChange}
                  handleChangePassword={handleChangePassword}
                  users={users}
                  loadUsers={loadUsers}
                  handleResetUserPassword={handleResetUserPassword}
                  user={user}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}