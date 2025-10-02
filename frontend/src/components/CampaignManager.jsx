import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { EmailEditor } from './EmailEditor';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Send, 
  Eye, 
  Trash2, 
  Calendar, 
  Users, 
  Mail,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Event Announcement Templates
const eventTemplates = {
  sinterklaas_show: {
    name: "Sinterklaas Show Aankondiging",
    subject: "🎭 Nieuwe Sinterklaas Show - Reserveer Nu!",
    blocks: [
      {
        id: '1',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600',
        alt: 'Sinterklaas Show',
        width: '100%'
      },
      {
        id: '2',
        type: 'text',
        content: '🎭 De Magische Sinterklaas Show',
        fontSize: '28px',
        color: '#d32f2f',
        bold: true
      },
      {
        id: '3',
        type: 'text',
        content: 'Beste vrienden van Sinterklaas,\n\nWe nodigen jullie graag uit voor onze spectaculaire Sinterklaas show! Een onvergetelijke ervaring vol muziek, dans en natuurlijk... surprises!',
        fontSize: '16px',
        color: '#333333'
      },
      {
        id: '4',
        type: 'divider',
        color: '#d32f2f',
        thickness: '2px'
      },
      {
        id: '5',
        type: 'text',
        content: '📅 Datum: [DATUM INVOEREN]\n🕐 Tijd: [TIJD INVOEREN]\n📍 Locatie: [LOCATIE INVOEREN]',
        fontSize: '18px',
        color: '#1976d2',
        bold: true
      },
      {
        id: '6',
        type: 'button',
        text: 'Tickets Reserveren',
        url: 'https://sinterklaasshow.nl/tickets',
        backgroundColor: '#d32f2f',
        textColor: '#ffffff'
      },
      {
        id: '7',
        type: 'spacer',
        height: '30px'
      },
      {
        id: '8',
        type: 'text',
        content: 'Met vriendelijke groet,\nHet Sinterklaas Show Team',
        fontSize: '14px',
        color: '#666666'
      }
    ]
  },
  special_event: {
    name: "Speciaal Evenement",
    subject: "✨ Exclusief Event - Jij bent Uitgenodigd!",
    blocks: [
      {
        id: '1',
        type: 'text',
        content: '✨ Speciaal Evenement',
        fontSize: '32px',
        color: '#8b5cf6',
        bold: true
      },
      {
        id: '2',
        type: 'text',
        content: 'Je bent uitgenodigd voor ons exclusieve evenement!',
        fontSize: '18px',
        color: '#333333'
      },
      {
        id: '3',
        type: 'spacer',
        height: '20px'
      },
      {
        id: '4',
        type: 'button',
        text: 'Meer Info',
        url: '#',
        backgroundColor: '#8b5cf6',
        textColor: '#ffffff'
      }
    ]
  },
  newsletter: {
    name: "Algemene Nieuwsbrief",
    subject: "📰 Nieuwsbrief - Laatste Updates",
    blocks: [
      {
        id: '1',
        type: 'text',
        content: '📰 Nieuwsbrief',
        fontSize: '28px',
        color: '#059669',
        bold: true
      },
      {
        id: '2',
        type: 'text',
        content: 'Blijf op de hoogte van alle laatste ontwikkelingen!',
        fontSize: '16px',
        color: '#333333'
      },
      {
        id: '3',
        type: 'divider',
        color: '#059669',
        thickness: '1px'
      }
    ]
  }
};

export function CampaignManager({ subscribers = [] }) {
  const [campaigns, setCampaigns] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignData, setCampaignData] = useState({
    name: '',
    from_name: 'Sinterklaas Show',
    from_email: 'noreply@sinterklaasshow.nl',
    reply_to: 'info@sinterklaasshow.nl'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [sending, setSending] = useState(false);

  // useCallback handlers to prevent focus issues
  const handleCampaignNameChange = useCallback((e) => {
    setCampaignData({...campaignData, name: e.target.value});
  }, [campaignData]);

  const handleFromNameChange = useCallback((e) => {
    setCampaignData({...campaignData, from_name: e.target.value});
  }, [campaignData]);

  const handleFromEmailChange = useCallback((e) => {
    setCampaignData({...campaignData, from_email: e.target.value});
  }, [campaignData]);

  const handleReplyToChange = useCallback((e) => {
    setCampaignData({...campaignData, reply_to: e.target.value});
  }, [campaignData]);

  // Ensure subscribers is always an array
  const safeSubscribers = Array.isArray(subscribers) ? subscribers : [];

  // API calls
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
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
      console.error('API call failed:', error);
      return { ok: false, status: 500 };
    }
  };

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await apiCall('/admin/newsletter/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Create campaign from template
  const createFromTemplate = (templateKey) => {
    const template = eventTemplates[templateKey];
    setCampaignData({
      name: template.name,
      from_name: 'Sinterklaas Show',
      from_email: 'noreply@sinterklaasshow.nl',
      reply_to: 'info@sinterklaasshow.nl'
    });
    setEditingCampaign({
      ...template,
      id: null,
      isNew: true
    });
    setShowEditor(true);
  };

  // Save campaign
  const saveCampaign = async (templateData) => {
    try {
      const campaignPayload = {
        name: campaignData.name,
        subject: templateData.subject,
        from_name: campaignData.from_name,
        from_email: campaignData.from_email,
        reply_to: campaignData.reply_to,
        html_content: templateData.html_content,
        preview_text: templateData.preheader || '',
        mailing_lists: [], // Can be extended for targeting
        tags: []
      };

      let response;
      if (editingCampaign?.id) {
        // Update existing campaign
        response = await apiCall(`/admin/newsletter/campaigns/${editingCampaign.id}`, {
          method: 'PUT',
          body: JSON.stringify(campaignPayload)
        });
      } else {
        // Create new campaign
        response = await apiCall('/admin/newsletter/campaigns', {
          method: 'POST',
          body: JSON.stringify(campaignPayload)
        });
      }

      if (response.ok) {
        toast.success('Campaign opgeslagen!');
        setShowEditor(false);
        setEditingCampaign(null);
        fetchCampaigns();
      } else {
        const error = await response.text();
        toast.error('Fout bij opslaan: ' + error);
      }
    } catch (error) {
      toast.error('Fout bij opslaan: ' + error.message);
    }
  };

  // Send campaign
  const sendCampaign = async (campaignId) => {
    if (!window.confirm(`Weet je zeker dat je deze campaign wilt versturen naar ${safeSubscribers.length} subscribers?`)) {
      return;
    }

    setSending(true);
    try {
      const response = await apiCall(`/admin/newsletter/campaigns/${campaignId}/send`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        fetchCampaigns();
      } else {
        const error = await response.text();
        toast.error('Fout bij versturen: ' + error);
      }
    } catch (error) {
      toast.error('Fout bij versturen: ' + error.message);
    }
    setSending(false);
  };

  // Delete campaign
  const deleteCampaign = async (campaignId) => {
    if (!window.confirm('Weet je zeker dat je deze campaign wilt verwijderen?')) {
      return;
    }

    try {
      const response = await apiCall(`/admin/newsletter/campaigns/${campaignId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Campaign verwijderd!');
        fetchCampaigns();
      }
    } catch (error) {
      toast.error('Fout bij verwijderen: ' + error.message);
    }
  };

  // Edit existing campaign
  const editCampaign = (campaign) => {
    setCampaignData({
      name: campaign.name,
      from_name: campaign.from_name,
      from_email: campaign.from_email,
      reply_to: campaign.reply_to
    });
    setEditingCampaign({
      ...campaign,
      blocks: [] // Would need to parse HTML back to blocks
    });
    setShowEditor(true);
  };

  // Show preview
  const handlePreview = (html) => {
    setPreviewHtml(html);
    setShowPreview(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary"><Edit size={12} className="mr-1" />Concept</Badge>;
      case 'sending':
        return <Badge variant="default"><Clock size={12} className="mr-1" />Verzenden</Badge>;
      case 'sent':
        return <Badge variant="default"><CheckCircle size={12} className="mr-1" />Verstuurd</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Nieuwe Campaign Maken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(eventTemplates).map(([key, template]) => (
              <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.subject}</p>
                  <Button onClick={() => createFromTemplate(key)} className="w-full">
                    Template Gebruiken
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={20} />
              Alle Campaigns ({campaigns.length})
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} />
              {safeSubscribers.length} Subscribers
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Van: {campaign.from_name} &lt;{campaign.from_email}&gt;</div>
                        <div>Gemaakt: {new Date(campaign.created_date).toLocaleDateString('nl-NL')}</div>
                        {campaign.sent_date && (
                          <div>Verstuurd: {new Date(campaign.sent_date).toLocaleDateString('nl-NL')}</div>
                        )}
                        {campaign.total_recipients > 0 && (
                          <div className="flex gap-4">
                            <span>📧 {campaign.total_recipients} verstuurd</span>
                            <span>📖 {campaign.opened} geopend</span>
                            <span>🖱️ {campaign.clicked} geklikt</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {campaign.status === 'draft' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editCampaign(campaign)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => sendCampaign(campaign.id)}
                            disabled={sending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Send size={14} />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCampaign(campaign.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {campaigns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Mail className="mx-auto mb-4" size={48} />
                <p>Nog geen campaigns. Maak je eerste campaign met een template hierboven!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-7xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign?.isNew ? 'Nieuwe Campaign' : 'Campaign Bewerken'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Campaign Naam</Label>
                <Input
                  value={campaignData.name}
                  onChange={handleCampaignNameChange}
                  placeholder="Bijv: Sinterklaas Show December 2024"
                />
              </div>
              <div>
                <Label>Van Naam</Label>
                <Input
                  value={campaignData.from_name}
                  onChange={(e) => setCampaignData({...campaignData, from_name: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Van Email</Label>
                <Input
                  type="email"
                  value={campaignData.from_email}
                  onChange={(e) => setCampaignData({...campaignData, from_email: e.target.value})}
                />
              </div>
              <div>
                <Label>Reply-To Email</Label>
                <Input
                  type="email"
                  value={campaignData.reply_to}
                  onChange={(e) => setCampaignData({...campaignData, reply_to: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {editingCampaign && (
              <EmailEditor
                initialTemplate={editingCampaign}
                onSave={saveCampaign}
                onPreview={handlePreview}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Email Voorbeeld</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full border rounded"
              title="Email Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CampaignManager;
