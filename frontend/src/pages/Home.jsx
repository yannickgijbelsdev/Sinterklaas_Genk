import React, { useState, useEffect } from 'react';
import { Camera, Clock, Users, ArrowRight, Star, Sparkles, Gift, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { LiveEditor } from '../components/LiveEditor';
import { MagicCurtain } from '../components/MagicCurtain';
import { StoombootBanner } from '../components/StoombootBanner';
import { showInfo as fallbackShowInfo, news as fallbackNews } from '../data/mock';
import { useNews, useContent, getContentValue } from '../hooks/useApi';
import '../styles/sinterklaas-theme.css';

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
            
            {/* Hero Section - Inspired by Camp Buddy */}
            <section className="sinterklaas-hero relative">
              {/* Decorative Elements */}
              <div className="sinterklaas-decoration" style={{top: '10%', left: '10%'}}>🎁</div>
              <div className="sinterklaas-decoration" style={{top: '20%', right: '15%'}}>⭐</div>
              <div className="sinterklaas-decoration" style={{bottom: '30%', left: '8%'}}>🎭</div>
              <div className="sinterklaas-decoration" style={{bottom: '20%', right: '10%'}}>✨</div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center min-h-[80vh]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                    
                    {/* Left Content */}
                    <div className="text-left">
                      <div className="mb-8">
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                          <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Magische Sinterklaas Ervaring</span>
                        </div>
                        
                        <h1 
                          className="hero-title mb-6"
                          data-editable-text="title"
                          data-section="hero"
                          data-key="title"
                        >
                          {showInfo.title}
                        </h1>
                        
                        <p 
                          className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg"
                          data-editable-text="description"
                          data-section="hero"
                          data-key="description"
                        >
                          {showInfo.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Link to="/gallery">
                          <Button className="btn-sinterklaas-primary group">
                            <Camera className="w-5 h-5 mr-2" />
                            Bekijk Galerij
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <Link to="/contact">
                          <Button className="btn-sinterklaas-outline">
                            Contact Ons
                          </Button>
                        </Link>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span>{showInfo.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-yellow-600" />
                          <span>Leeftijd: {showInfo.ageRange}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span>{showInfo.language}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Content - Hero Image */}
                    <div className="relative">
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img
                          src={showInfo.heroImage}
                          alt="Sinterklaas Show"
                          className="w-full h-[500px] object-cover"
                          data-editable-image="hero_image"
                          data-section="hero"
                          data-key="background_image"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      
                      {/* Floating Stats Cards */}
                      <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border-4 border-yellow-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">1000+</div>
                          <div className="text-sm text-gray-600">Blije Kinderen</div>
                        </div>
                      </div>
                      
                      <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border-4 border-red-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">50+</div>
                          <div className="text-sm text-gray-600">Magische Shows</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="section-white-background py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 
                    className="section-title"
                    data-editable-text="title"
                    data-section="home"
                    data-key="features_title"
                  >
                    Waarom Kiezen Voor Onze Show?
                  </h2>
                  <p 
                    className="section-subtitle max-w-3xl mx-auto"
                    data-editable-text="description"
                    data-section="home"
                    data-key="features_description"
                  >
                    Ontdek wat onze Sinterklaas show zo bijzonder maakt voor jouw kind en het hele gezin.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="sinterklaas-card text-center group">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Interactieve Ervaring</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Kinderen worden actief betrokken bij de show met zingen, dansen en meedoen met Sinterklaas en zijn Pieten.
                      </p>
                    </div>
                  </div>

                  <div className="sinterklaas-card text-center group">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Magische Momenten</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Vol verrassingen, cadeautjes en echte magie die kinderen doen geloven in de wonderen van Sinterklaas.
                      </p>
                    </div>
                  </div>

                  <div className="sinterklaas-card text-center group">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Professionele Cast</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Ervaren acteurs en performers die de magie van Sinterklaas tot leven brengen voor alle leeftijden.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Latest News Section */}
            <section className="section-gold-background py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 
                    className="section-title"
                    data-editable-text="title"
                    data-section="home"
                    data-key="news_section_title"
                  >
                    Laatste Nieuws
                  </h2>
                  <p 
                    className="section-subtitle"
                    data-editable-text="description"
                    data-section="home"
                    data-key="news_section_description"
                  >
                    Blijf op de hoogte van alle nieuwtjes rondom onze magische Sinterklaas shows.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {featuredNews.map((article) => (
                    <div key={article.id} className="news-card">
                      <div className="news-image">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="news-content">
                        <div className="news-date">{article.date}</div>
                        <h3 className="news-title text-xl font-bold mb-3">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>
                        <Link to={`/news/${article.id}`}>
                          <Button variant="ghost" className="p-0 text-red-600 hover:text-red-700 font-medium">
                            Lees meer
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Link to="/news">
                    <Button className="btn-sinterklaas-secondary">
                      Alle Nieuws Bekijken
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Gallery Preview */}
            <section className="section-white-background py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 
                    className="section-title"
                    data-editable-text="title"
                    data-section="gallery"
                    data-key="section_title"
                  >
                    Galerij Voorproefje
                  </h2>
                  <p 
                    className="section-subtitle"
                    data-editable-text="description"
                    data-section="gallery"
                    data-key="section_description"
                  >
                    Bekijk de mooiste momenten van onze magische Sinterklaas shows.
                  </p>
                </div>

                <div className="gallery-grid mb-12">
                  {[
                    {
                      url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80",
                      alt: "Sinterklaas met kinderen"
                    },
                    {
                      url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80", 
                      alt: "Magische show momenten"
                    },
                    {
                      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
                      alt: "Blije kinderen"
                    },
                    {
                      url: "https://images.unsplash.com/photo-1544373022-df25aea89bd4?w=400&q=80",
                      alt: "Sinterklaas show"
                    }
                  ].map((image, index) => (
                    <div key={index} className="gallery-item group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Link to="/gallery">
                    <Button className="btn-sinterklaas-primary">
                      <Camera className="w-5 h-5 mr-2" />
                      Volledige Galerij Bekijken
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="section-warm-background py-20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="relative">
                  <div className="absolute -top-8 -left-8 text-6xl opacity-10">🎁</div>
                  <div className="absolute -bottom-8 -right-8 text-6xl opacity-10">✨</div>
                  
                  <h2 className="section-title mb-6">
                    Klaar voor een Onvergetelijke Ervaring?
                  </h2>
                  <p className="section-subtitle mb-10">
                    Boek nu je tickets voor de meest magische Sinterklaas show van het jaar!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/contact">
                      <Button className="btn-sinterklaas-primary text-lg px-8 py-4">
                        <Gift className="w-6 h-6 mr-2" />
                        Boek Nu Je Tickets
                      </Button>
                    </Link>
                    <Link to="/gallery">
                      <Button className="btn-sinterklaas-outline text-lg px-8 py-4">
                        Bekijk Meer Foto's
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </LiveEditor>
      </div>
    </>
  );
}