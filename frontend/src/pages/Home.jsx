import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SparkleBackground } from '../components/SparkleBackground';
import { LiveEditor } from '../components/LiveEditor';
import { MagicCurtain } from '../components/MagicCurtain';
import { showInfo as fallbackShowInfo, news as fallbackNews } from '../data/mock';
import { useNews, useContent, getContentValue } from '../hooks/useApi';

export default function Home() {
  const [showCurtain, setShowCurtain] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const { data: newsData } = useNews();
  const { data: contentData } = useContent();

  useEffect(() => {
    // Simulate app loading time
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCurtainComplete = () => {
    setShowCurtain(false);
  };
  
  // Use API data or fallback to mock data
  const news = newsData || fallbackNews;
  
  // Create dynamic showInfo from database content
  const showInfo = {
    title: getContentValue(contentData, 'hero', 'title', fallbackShowInfo.title),
    subtitle: getContentValue(contentData, 'hero', 'subtitle', fallbackShowInfo.subtitle),
    description: getContentValue(contentData, 'hero', 'description', fallbackShowInfo.description),
    heroImage: getContentValue(contentData, 'hero', 'background_image', fallbackShowInfo.heroImage),
    duration: fallbackShowInfo.duration,
    ageRange: fallbackShowInfo.ageRange,
    language: fallbackShowInfo.language
  };
  
  const featuredNews = news.slice(0, 2);

  return (
    <>
      {/* Magic Curtain Loader - Only for Home page */}
      {showCurtain && (
        <MagicCurtain 
          isLoading={!appReady} 
          onAnimationComplete={handleCurtainComplete}
        />
      )}
      
      {/* Home Content */}
      <div className={`transition-opacity duration-500 ${showCurtain ? 'opacity-0' : 'opacity-100'}`}>
        <LiveEditor pageKey="home">
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
                data-editable-image="background"
                data-section="hero"
                data-key="background_image"
                key={showInfo.heroImage} // Force re-render when image changes
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 rounded-3xl"></div>
            </div>
            
            {/* Subtle sparkles in hero */}
            <SparkleBackground density="light" animation="slow" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <div className="text-5xl mb-4 hero-float">🎭✨</div>
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              data-editable-text="title"
              data-section="hero"
              data-key="title"
            >
              {showInfo.title}
            </h1>
            <p 
              className="text-xl md:text-2xl mb-6 font-medium"
              data-editable-text="subtitle"
              data-section="hero"
              data-key="subtitle"
            >
              {showInfo.subtitle}
            </p>
            <p 
              className="text-base md:text-lg mb-8 opacity-90 max-w-2xl mx-auto"
              data-editable-text="description"
              data-section="hero"
              data-key="description"
            >
              {showInfo.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/shows">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold">
                Bekijk Show Data
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg">
                Meer Info
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>{showInfo.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span>Leeftijd: {showInfo.ageRange}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star size={16} />
              <span>{showInfo.language}</span>
            </div>
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section 
        className="py-16 bg-gradient-to-b from-red-50 to-white relative overflow-hidden"
        data-editable-color="news_section_bg"
        data-section="home"
        data-key="news_section_bg"
      >
        {/* Ultra subtle sparkles for news section */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <SparkleBackground density="light" animation="slow" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              data-editable-text="title"
              data-section="home"
              data-key="news_section_title"
            >
              Laatste Nieuws
            </h2>
            <p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              data-editable-text="description"
              data-section="home"
              data-key="news_section_description"
            >
              Blijf op de hoogte van alle nieuwtjes rondom de show.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredNews.map((article) => (
              <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 fun-card bg-gradient-to-br from-white to-red-50/30">
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
              <Button 
                variant="outline" 
                size="lg" 
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                data-editable-button="news_button"
                data-section="home"
                data-key="news_button"
              >
                Alle Nieuws Bekijken
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Subtle sparkles for gallery section */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20 select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: '0.6rem',
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: '6s',
                animation: 'subtle-twinkle 6s ease-in-out infinite'
              }}
            >
              📸
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              data-editable-text="title"
              data-section="gallery"
              data-key="section_title"
            >
              Galerij Voorproefje
            </h2>
            <p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              data-editable-text="description"
              data-section="gallery"
              data-key="section_description"
            >
              Bekijk de mooiste momenten van onze magische Sinterklaas shows.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80",
              "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
              "https://images.unsplash.com/photo-1544373022-df25aea89bd4?w=400&q=80"
            ].map((image, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Galerij foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/gallery">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                data-editable-button="gallery_button"
                data-section="home"
                data-key="gallery_button"
              >
                Volledige Galerij Bekijken
              </Button>
            </Link>
          </div>
        </div>
      </section>
        </div>
      </LiveEditor>
      </div>
    </>
  );
}