import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { news } from '../data/mock';

export default function News() {
  const { id } = useParams();
  
  // If there's an ID in the URL, show single article
  if (id) {
    const article = news.find(item => item.id === parseInt(id));
    
    if (!article) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel niet gevonden</h1>
            <Link to="/news">
              <Button>Terug naar nieuws</Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        <article className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link to="/news">
                <Button variant="ghost" className="text-red-600 hover:text-red-700">
                  <ArrowLeft className="mr-2" size={16} />
                  Terug naar nieuws
                </Button>
              </Link>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 text-gray-500 mb-4">
                <Calendar size={16} />
                <span>{article.date}</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>
            </div>

            <div className="aspect-video mb-8 overflow-hidden rounded-lg">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>{article.content}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Deel dit artikel</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">Facebook</Button>
                    <Button variant="outline" size="sm">Twitter</Button>
                    <Button variant="outline" size="sm">WhatsApp</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Show news overview
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Nieuws & Updates</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Blijf op de hoogte van alle laatste nieuwtjes, updates en aankondigingen 
            rondom onze Sinterklaas show.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="bg-red-100 text-red-800 mb-4">Hoofdartikel</Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
                <img
                  src={news[0].image}
                  alt={news[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 text-gray-500 mb-4">
                <Calendar size={16} />
                <span>{news[0].date}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{news[0].title}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">{news[0].excerpt}</p>
              <Link to={`/news/${news[0].id}`}>
                <Button className="bg-red-600 hover:bg-red-700">
                  Lees volledig artikel
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Alle Nieuws</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 text-gray-500 mb-3">
                    <Calendar size={14} />
                    <span className="text-sm">{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <Link to={`/news/${article.id}`}>
                    <Button variant="ghost" className="p-0 text-red-600 hover:text-red-700 group">
                      Lees meer
                      <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-200" size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Blijf Op De Hoogte</h2>
          <p className="text-xl mb-8 opacity-90">
            Schrijf je in voor onze nieuwsbrief en mis geen enkel nieuwtje over de show!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Je e-mailadres"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-red-600 hover:bg-gray-100 px-6">
              Aanmelden
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}