import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

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

  // Show news overview
  return (
    <LiveEditor pageKey="news">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-red-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-5xl font-bold text-gray-900 mb-6"
              data-editable-text="title"
              data-section="news"
              data-key="title"
            >
              {pageTitle}
            </h1>
            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              data-editable-text="subtitle"
              data-section="news"
              data-key="subtitle"
            >
              {pageSubtitle}
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
                    data-editable-image="featured_image"
                    data-section="news"
                    data-key="featured_image"
                    key={news[0].image}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 text-gray-500 mb-4">
                  <Calendar size={16} />
                  <span>{news[0].date}</span>
                </div>
                <h2 
                  className="text-3xl font-bold text-gray-900 mb-4"
                  data-editable-text="featured_title"
                  data-section="news"
                  data-key="featured_title"
                >
                  {news[0].title}
                </h2>
                <p 
                  className="text-lg text-gray-600 mb-6 leading-relaxed"
                  data-editable-text="featured_excerpt"
                  data-section="news"
                  data-key="featured_excerpt"
                >
                  {news[0].excerpt}
                </p>
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
            <h2 
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
              data-editable-text="all_news_title"
              data-section="news"
              data-key="all_news_title"
            >
              Alle Nieuws
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article) => (
                <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      data-editable-image={`news_${article.id}_image`}
                      data-section="news"
                      data-key={`news_${article.id}_image`}
                      key={article.image}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-gray-500 mb-3">
                      <Calendar size={14} />
                      <span className="text-sm">{article.date}</span>
                    </div>
                    <h3 
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-200"
                      data-editable-text={`news_${article.id}_title`}
                      data-section="news"
                      data-key={`news_${article.id}_title`}
                    >
                      {article.title}
                    </h3>
                    <p 
                      className="text-gray-600 mb-4 line-clamp-3"
                      data-editable-text={`news_${article.id}_excerpt`}
                      data-section="news"
                      data-key={`news_${article.id}_excerpt`}
                    >
                      {article.excerpt}
                    </p>
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
            <h2 
              className="text-4xl font-bold mb-4"
              data-editable-text="newsletter_title"
              data-section="news"
              data-key="newsletter_title"
            >
              {newsletterTitle}
            </h2>
            <p 
              className="text-xl mb-8 opacity-90"
              data-editable-text="newsletter_subtitle"
              data-section="news"
              data-key="newsletter_subtitle"
            >
              {newsletterSubtitle}
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
    </LiveEditor>
  );
}