import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { showInfo, showDates, characters, news } from '../data/mock';

export default function Home() {
  const upcomingShows = showDates.slice(0, 3);
  const featuredNews = news.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[500px] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 z-0">
              <img
                src={showInfo.heroImage}
                alt="Sinterklaas Show"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 rounded-3xl"></div>
            </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <div className="text-5xl mb-4">🎭✨</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {showInfo.title}
            </h1>
            <p className="text-xl md:text-2xl mb-6 font-medium">
              {showInfo.subtitle}
            </p>
            <p className="text-base md:text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              {showInfo.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Link to="/shows">
              <Button size="default" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-semibold">
                Bekijk Show Data
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="default" className="border-white text-white hover:bg-white hover:text-gray-900 px-6 py-2">
                Meer Info
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{showInfo.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>Leeftijd: {showInfo.ageRange}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star size={14} />
              <span>{showInfo.language}</span>
            </div>
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* Upcoming Shows */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Aankomende Voorstellingen</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mis de magische Sinterklaas show niet! Kies jouw ideale datum en locatie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {upcomingShows.map((show) => (
              <Card key={show.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 text-red-600 mb-2">
                        <Calendar size={16} />
                        <span className="font-semibold">{show.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <Clock size={16} />
                        <span>{show.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin size={16} />
                        <span>{show.venue}, {show.city}</span>
                      </div>
                    </div>
                    <Badge variant={show.ticketsAvailable ? "default" : "secondary"}>
                      {show.ticketsAvailable ? "Beschikbaar" : "Uitverkocht"}
                    </Badge>
                  </div>
                  
                  {show.ticketsAvailable && (
                    <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-red-600 hover:bg-red-700 group-hover:scale-105 transition-transform duration-200">
                        Tickets Kopen
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/shows">
              <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                Alle Data Bekijken
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Characters Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ontmoet de Karakters</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Maak kennis met Sinterklaas en zijn vrolijke helpers die jouw show onvergetelijk maken.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {characters.map((character) => (
              <div key={character.id} className="text-center group">
                <div className="relative mb-6 overflow-hidden rounded-full w-48 h-48 mx-auto">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{character.name}</h3>
                <p className="text-gray-600 mb-4">{character.description}</p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">💡 {character.funFact}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/characters">
              <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                Alle Karakters Ontdekken
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Laatste Nieuws</h2>
            <p className="text-xl text-gray-600">Blijf op de hoogte van alle nieuwtjes rondom de show.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredNews.map((article) => (
              <Card key={article.id} className="group hover:shadow-xl transition-all duration-300">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Link to={`/news/${article.id}`}>
                    <Button variant="ghost" className="p-0 text-red-600 hover:text-red-700">
                      Lees meer
                      <ArrowRight className="ml-1" size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/news">
              <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                Alle Nieuws Bekijken
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}