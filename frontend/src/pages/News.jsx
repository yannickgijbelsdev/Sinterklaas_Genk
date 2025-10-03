import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight, Clock, Gift, Mail } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { initializeAudioPlayers } from '../utils/audioPlayerUtils';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

// Utility function to create URL slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

// No demo data - show real content only

// Utility function to find article by slug or ID
const findArticleBySlugOrId = (articles, slugOrId) => {
  if (!articles || !slugOrId) return null;
  
  // First try to find by ID (for backward compatibility)
  let article = articles.find(item => item.id === slugOrId);
  if (article) return article;
  
  // Then try to find by matching slug
  return articles.find(item => createSlug(item.title) === slugOrId);
};

export default function News() {
  const { slug, id } = useParams(); // Get both slug and id for backward compatibility
  const paramValue = slug || id; // Use slug if available, fallback to id
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/news`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setNewsData(data);
          } else {
            setNewsData([]);
          }
        } else {
          setError('Kon nieuws niet laden');
        }
      } catch (err) {
        setError('Error loading news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchNews();
  }, []);

  // Initialize audio players after content is loaded - NO DOM MANIPULATION
  useEffect(() => {
    if (newsData && newsData.length > 0) {
      // Only initialize wave players that already exist, don't modify DOM
      setTimeout(() => {
        initializeAudioPlayers();
      }, 100);
    }
  }, [newsData]);
  
  // Loading state - removed for instant display

  // Don't render anything until we're completely done loading
  if (!initialized || loading) {
    return <div className="min-h-screen"></div>;
  }

  // Use real news data only - no fallback to demo data
  const displayData = newsData || [];

  // If there's a slug/ID in the URL, show single article
  if (paramValue) {
    const article = findArticleBySlugOrId(displayData, paramValue);
    
    if (!article) {
      return <div className="min-h-screen"></div>;
    }

    return (
      <div className="min-h-screen flex flex-col">
        {/* Header Spacer */}
        <div className="pt-24"></div>
        
        <article className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Featured Image */}
            {(article.featured_image || article.image) && (
              <div className="mb-12">
                <img
                  src={(() => {
                    const imgUrl = article.featured_image || article.image;
                    return imgUrl.startsWith('/') 
                      ? `${process.env.REACT_APP_BACKEND_URL}${imgUrl}`
                      : imgUrl;
                  })()}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
            
            {/* Article Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {article.category || 'Algemeen'}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {article.excerpt}
                </p>
              )}
            </div>
            
            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-16">
              <div 
                style={{ lineHeight: '1.8', color: '#374151', fontSize: '18px' }}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    let content = article.content;
                    
                    // First handle images (before links to prevent conflict)
                    content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
                      '<div style="text-align: center; margin: 20px 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" /></div>');
                    
                    // Handle audio containers
                    content = content.replace(/<div class="audio-container">/g, 
                      '<div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">');
                    content = content.replace(/<h4>/g, 
                      '<h4 style="margin: 0 0 10px 0; color: #374151;">');
                    content = content.replace(/<audio controls>/g, 
                      '<audio controls style="width: 100%; margin-top: 10px;">');
                    
                    // Handle text formatting
                    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
                    content = content.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
                    
                    // Handle links (after images)
                    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
                      '<a href="$2" target="_blank" style="color: #DC2626; text-decoration: underline; font-weight: 500;">$1</a>');
                    
                    // Handle lists
                    content = content.replace(/\n- /g, '<br/>• ');
                    content = content.replace(/\n(\d+)\. /g, '<br/>$1. ');
                    
                    // Handle paragraphs (but preserve existing HTML)
                    if (!content.includes('<div') && !content.includes('<img') && !content.includes('<audio')) {
                      content = content.replace(/\n\n/g, '</p><p>');
                      content = '<p>' + content + '</p>';
                    } else {
                      // Just handle line breaks for mixed content
                      content = content.replace(/\n\n/g, '<br/><br/>');
                    }
                    
                    return content;
                  })()
                }}
              />
            </div>
            
          </div>
        </article>
        
        {/* Wave Shape Above Footer */}
        <div className="relative">
          <svg 
            className="block w-full h-24" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0 C300,60 900,60 1200,0 L1200,120 L0,120 Z" 
              style={{ fill: '#FEF7ED' }}
            ></path>
          </svg>
        </div>

        {/* Enhanced Footer */}
        <footer 
          className="mt-auto"
          style={{ background: '#FEF7ED', padding: '60px 0 40px 0' }}
          data-section-id="footer_section"
        >
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            {/* Main Footer Content */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '40px', 
              marginBottom: '40px' 
            }}>
              {/* Brand Section */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <img 
                    src="https://customer-assets.emergentagent.com/job_genk-sint-site/artifacts/1x6rjv7u_SW_HQ_Logo.png"
                    alt="Studio Wonderland Logo"
                    style={{ 
                      height: '96px', 
                      width: 'auto',
                      filter: 'brightness(0) saturate(100%) invert(24%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(92%) contrast(92%)'
                    }}
                    data-edit-id="footer_logo"
                  />
                </div>
                <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto' }}>
                  De meest magische Sinterklaas ervaring voor het hele gezin in Genk.
                </p>
              </div>

              {/* Contact Info Section */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#DC2626', marginBottom: '20px' }}>
                  Contact
                </h3>
                <div style={{ color: '#666', fontSize: '15px', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={18} color="#DC2626" />
                    <a 
                      href="mailto:info@sinterklaasgenk.be" 
                      style={{ color: '#DC2626', textDecoration: 'none' }}
                      onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                    >
                      info@sinterklaasgenk.be
                    </a>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Studio Wonderland</strong>
                  </div>
                  <div style={{ fontSize: '13px', color: '#888' }}>
                    Ondernemingsnummer: BE1008.607.780
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div style={{ 
              textAlign: 'center', 
              paddingTop: '30px', 
              borderTop: '1px solid #E5E7EB' 
            }}>
              <p 
                style={{ color: '#666', fontSize: '14px', margin: '0' }}
                data-edit-id="footer_copyright"
              >
                © 2025 Sinterklaas Genk - Studio Wonderland. Alle rechten voorbehouden.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // This check is now handled at the top of the component

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
          {displayData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayData.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Featured Image */}
                <div className="aspect-video overflow-hidden">
                  {(article.featured_image || article.image) ? (
                    <img
                      src={(() => {
                        const imgUrl = article.featured_image || article.image;
                        return imgUrl.startsWith('/') 
                          ? `${process.env.REACT_APP_BACKEND_URL}${imgUrl}`
                          : imgUrl;
                      })()}
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
                  {/* Category only */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      {article.category || 'Algemeen'}
                    </Badge>
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
                  <Link to={`/nieuws/${createSlug(article.title)}`}>
                    <Button variant="outline" className="w-full group">
                      Lees meer
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Geen nieuws beschikbaar</h3>
              <p className="text-gray-600">Er zijn momenteel geen nieuwsartikelen om te tonen.</p>
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
        
        {/* Wave Shape Above Footer */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-24" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0 C300,60 900,60 1200,0 L1200,120 L0,120 Z" 
              style={{ fill: '#FEF7ED' }}
            ></path>
          </svg>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer 
        style={{ background: '#FEF7ED', padding: '60px 0 40px 0' }}
        data-section-id="footer_section"
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Main Footer Content */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '40px', 
            marginBottom: '40px' 
          }}>
            {/* Brand Section */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <img 
                  src="https://customer-assets.emergentagent.com/job_genk-sint-site/artifacts/1x6rjv7u_SW_HQ_Logo.png"
                  alt="Studio Wonderland Logo"
                  style={{ 
                    height: '96px', 
                    width: 'auto',
                    filter: 'brightness(0) saturate(100%) invert(24%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(92%) contrast(92%)'
                  }}
                  data-edit-id="footer_logo"
                />
              </div>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto' }}>
                De meest magische Sinterklaas ervaring voor het hele gezin in Genk.
              </p>
            </div>

            {/* Contact Info Section */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#DC2626', marginBottom: '20px' }}>
                Contact
              </h3>
              <div style={{ color: '#666', fontSize: '15px', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={18} color="#DC2626" />
                  <a 
                    href="mailto:info@sinterklaasgenk.be" 
                    style={{ color: '#DC2626', textDecoration: 'none' }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    info@sinterklaasgenk.be
                  </a>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Studio Wonderland</strong>
                </div>
                <div style={{ fontSize: '13px', color: '#888' }}>
                  Ondernemingsnummer: BE1008.607.780
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{ 
            textAlign: 'center', 
            paddingTop: '30px', 
            borderTop: '1px solid #E5E7EB' 
          }}>
            <p 
              style={{ color: '#666', fontSize: '14px', margin: '0' }}
              data-edit-id="footer_copyright"
            >
              © 2025 Sinterklaas Genk - Studio Wonderland. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}