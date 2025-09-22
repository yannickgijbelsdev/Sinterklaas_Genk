import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { showDates } from '../data/mock';

export default function Shows() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Show Data & Locaties</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kies de perfecte datum en locatie voor jouw magische Sinterklaas ervaring. 
            Boek snel, want de voorstellingen zijn erg populair!
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Belangrijke Informatie</h2>
            <p className="text-xl text-gray-600">Alles wat je moet weten voor je bezoek</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="text-3xl mb-4">🎟️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tickets</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Kinderen onder 2 jaar gratis op schoot</li>
                  <li>• Online boeken aanbevolen</li>
                  <li>• Groepskortingen vanaf 10 personen</li>
                  <li>• Ticket omruilen mogelijk tot 24u voor de show</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="text-3xl mb-4">🚗</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Parkeren</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Parkeergarages nabij alle theaters</li>
                  <li>• Kom op tijd voor drukte</li>
                  <li>• OV wordt aanbevolen in stadscentra</li>
                  <li>• Speciale familie parkeerplaatsen</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="text-3xl mb-4">⏰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Aankomst</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Aankomst 30 minuten voor aanvang</li>
                  <li>• Tijd voor foto's met karakters</li>
                  <li>• Foyer activiteiten voor kinderen</li>
                  <li>• Late binnenkomers na pauze</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Veelgestelde Vragen</h2>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hoe lang duurt de voorstelling?</h3>
              <p className="text-gray-600">De show duurt 75 minuten inclusief een pauze van 15 minuten. Perfect voor de aandachtsspanne van kinderen.</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Is de show geschikt voor peuters?</h3>
              <p className="text-gray-600">Absoluut! De show is speciaal ontworpen voor kinderen van 3-12 jaar, maar ook peuters genieten van de muziek en kleuren.</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kunnen kinderen meedoen?</h3>
              <p className="text-gray-600">Ja! Er zijn verschillende interactieve momenten waar kinderen kunnen meezingen, dansen en zelfs op het podium kunnen komen.</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Krijgen kinderen cadeautjes?</h3>
              <p className="text-gray-600">Alle kinderen krijgen een kleine verrassing van Sinterklaas tijdens de show. Een mooie herinnering aan deze magische dag!</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}