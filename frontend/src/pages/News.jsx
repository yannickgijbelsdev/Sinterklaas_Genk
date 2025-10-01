import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

export default function News() {
  const { id } = useParams();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API}/news`);
        if (response.ok) {
          const data = await response.json();
          setNewsData(data);
        } else {
          setError('Kon nieuws niet laden');
        }
      } catch (err) {
        setError('Error loading news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <div className="text-xl">Nieuws laden...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Fout bij laden van nieuws</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Probeer opnieuw</Button>
        </div>
      </div>
    );
  }

  // If there's an ID in the URL, show single article
  if (id) {
    const article = newsData.find(item => item.id === id);
    
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
                <Button variant="outline" className="mb-6">
                  <ArrowLeft size={16} className="mr-2" />
                  Terug naar nieuws
                </Button>
              </Link>
            </div>
            
            {/* Featured Image */}
            {(article.featured_image || article.image) && (
              <div className="mb-8">
                <img
                  src={article.featured_image || article.image}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
            
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {article.category || 'Algemeen'}
                </Badge>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar size={16} className="mr-2" />
                  {new Date(article.date).toLocaleDateString('nl-NL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
            </div>
            
            {/* Article Content */}
            <div className="prose max-w-none">
              <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between">
                <Link to="/news">
                  <Button variant="outline">
                    <ArrowLeft size={16} className="mr-2" />
                    Alle nieuws
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Main news listing page
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nieuws & Updates
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Blijf op de hoogte van alle laatste nieuwtjes, updates en aankondigingen rondom onze Sinterklaas show.
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {newsData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Geen nieuws beschikbaar</h3>
              <p className="text-gray-600">Er zijn momenteel geen nieuwsartikelen om te tonen.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsData.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Featured Image */}
                  <div className="aspect-video overflow-hidden">
                    {(article.featured_image || article.image) ? (
                      <img
                        src={article.featured_image || article.image}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <div className="text-4xl">📰</div>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    {/* Category and Date */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {article.category || 'Algemeen'}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={14} className="mr-1" />
                        {new Date(article.date).toLocaleDateString('nl-NL')}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    {/* Excerpt */}
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    
                    {/* Read More */}
                    <Link to={`/news/${article.id}`}>
                      <Button variant="outline" className="w-full group">
                        Lees meer
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Blijf Op De Hoogte
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Schrijf je in voor onze nieuwsbrief en mis geen enkel nieuwtje over de show!
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Je email adres"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-r-lg">
              Inschrijven
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            We respecteren je privacy en sturen geen spam.
          </p>
        </div>
      </section>
    </div>
  );
}