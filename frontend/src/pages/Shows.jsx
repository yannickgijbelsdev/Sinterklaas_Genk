import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LiveEditor } from '../components/LiveEditor';
import { showDates } from '../data/mock';
import { useContent, getContentValue } from '../hooks/useApi';

export default function Shows() {
  const { data: contentData } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  // Get dynamic content with fallbacks
  const pageTitle = getContentValue(contentData, 'shows', 'title', 'Show Data & Locaties');
  const pageSubtitle = getContentValue(contentData, 'shows', 'subtitle', 'Kies de perfecte datum en locatie voor jouw magische Sinterklaas ervaring. Boek snel, want de voorstellingen zijn erg populair!');
  const importantInfoTitle = getContentValue(contentData, 'shows', 'important_info_title', 'Belangrijke Informatie');
  const importantInfoSubtitle = getContentValue(contentData, 'shows', 'important_info_subtitle', 'Alles wat je moet weten voor je bezoek');

  // Get unique cities for filter
  const cities = [...new Set(showDates.map(show => show.city))];

  // Filter shows based on search and city filter
  const filteredShows = showDates.filter(show => {
    const matchesSearch = show.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         show.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === 'all' || show.city === filterCity;
    return matchesSearch && matchesCity;
  });

  return (
    <LiveEditor pageKey="shows">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-red-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-5xl font-bold text-gray-900 mb-6"
              data-editable-text="title"
              data-section="shows"
              data-key="title"
            >
              {pageTitle}
            </h1>
            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              data-editable-text="subtitle"
              data-section="shows"
              data-key="subtitle"
            >
              {pageSubtitle}
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Zoek op venue of stad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={20} />
                <Select value={filterCity} onValueChange={setFilterCity}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter op stad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle steden</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Shows Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredShows.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Geen voorstellingen gevonden</h3>
                <p className="text-gray-600">Probeer een andere zoekterm of filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShows.map((show) => (
                  <Card key={show.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 text-red-600 mb-2">
                            <Calendar size={18} />
                            <span className="font-bold text-lg">{show.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-2">
                            <Clock size={16} />
                            <span className="font-medium">{show.time}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={show.ticketsAvailable ? "default" : "secondary"}
                          className={`${show.ticketsAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {show.ticketsAvailable ? "Beschikbaar" : "Uitverkocht"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div>
                          <div className="flex items-start space-x-2 text-gray-800">
                            <MapPin size={16} className="mt-1 text-gray-500" />
                            <div>
                              <div className="font-semibold">{show.venue}</div>
                              <div className="text-sm text-gray-600">{show.city}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {show.ticketsAvailable ? (
                          <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer" className="block">
                            <Button className="w-full bg-red-600 hover:bg-red-700 group-hover:scale-105 transition-all duration-200">
                              Tickets Kopen
                              <ExternalLink className="ml-2" size={16} />
                            </Button>
                          </a>
                        ) : (
                          <Button disabled className="w-full">
                            Uitverkocht
                          </Button>
                        )}
                        <Button variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                          Route Plannen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Important Info */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                data-editable-text="important_info_title"
                data-section="shows"
                data-key="important_info_title"
              >
                {importantInfoTitle}
              </h2>
              <p 
                className="text-xl text-gray-600"
                data-editable-text="important_info_subtitle"
                data-section="shows"
                data-key="important_info_subtitle"
              >
                {importantInfoSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="text-3xl mb-4">🎟️</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="tickets_title"
                    data-section="shows"
                    data-key="tickets_title"
                  >
                    Tickets
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li
                      data-editable-text="tickets_info_1"
                      data-section="shows"
                      data-key="tickets_info_1"
                    >
                      • Kinderen onder 2 jaar gratis op schoot
                    </li>
                    <li
                      data-editable-text="tickets_info_2"
                      data-section="shows"
                      data-key="tickets_info_2"
                    >
                      • Online boeken aanbevolen
                    </li>
                    <li
                      data-editable-text="tickets_info_3"
                      data-section="shows"
                      data-key="tickets_info_3"
                    >
                      • Groepskortingen vanaf 10 personen
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="text-3xl mb-4">🚗</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="parking_title"
                    data-section="shows"
                    data-key="parking_title"
                  >
                    Parkeren
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li
                      data-editable-text="parking_info_1"
                      data-section="shows"
                      data-key="parking_info_1"
                    >
                      • Gratis parkeren bij meeste venues
                    </li>
                    <li
                      data-editable-text="parking_info_2"
                      data-section="shows"
                      data-key="parking_info_2"
                    >
                      • Kom 30 minuten voor aanvang
                    </li>
                    <li
                      data-editable-text="parking_info_3"
                      data-section="shows"
                      data-key="parking_info_3"
                    >
                      • Routebeschrijving bij bevestiging
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="text-3xl mb-4">📱</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="contact_title"
                    data-section="shows"
                    data-key="contact_title"
                  >
                    Contact
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li
                      data-editable-text="contact_info_1"
                      data-section="shows"
                      data-key="contact_info_1"
                    >
                      • Vragen? Bel ons tijdens kantooruren
                    </li>
                    <li
                      data-editable-text="contact_info_2"
                      data-section="shows"
                      data-key="contact_info_2"
                    >
                      • WhatsApp support beschikbaar
                    </li>
                    <li
                      data-editable-text="contact_info_3"
                      data-section="shows"
                      data-key="contact_info_3"
                    >
                      • Noodlijn op show dagen
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Practical Tips */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold mb-4"
                data-editable-text="tips_title"
                data-section="shows"
                data-key="tips_title"
              >
                Handige Tips
              </h2>
              <p 
                className="text-xl opacity-90"
                data-editable-text="tips_subtitle"
                data-section="shows"
                data-key="tips_subtitle"
              >
                Voor de best mogelijke ervaring
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl mb-3">👕</div>
                <h3 
                  className="text-xl font-bold mb-2"
                  data-editable-text="tip_1_title"
                  data-section="shows"
                  data-key="tip_1_title"
                >
                  Kleding
                </h3>
                <p 
                  className="opacity-90"
                  data-editable-text="tip_1_description"
                  data-section="shows"
                  data-key="tip_1_description"
                >
                  Kleed je comfortabel en in laagjes. Theaters kunnen warm worden tijdens de voorstelling!
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl mb-3">📸</div>
                <h3 
                  className="text-xl font-bold mb-2"
                  data-editable-text="tip_2_title"
                  data-section="shows"
                  data-key="tip_2_title"
                >
                  Foto's
                </h3>
                <p 
                  className="opacity-90"
                  data-editable-text="tip_2_description"
                  data-section="shows"
                  data-key="tip_2_description"
                >
                  Foto's maken is toegestaan voor de show en in de pauze. Tijdens de voorstelling graag geen flitsfotografie.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LiveEditor>
  );
}