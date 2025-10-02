import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight, Clock, Gift } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { initializeAudioPlayers } from '../utils/audioPlayerUtils';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

export default function News() {
  const { id } = useParams();
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

  // Initialize audio players after content is loaded
  useEffect(() => {
    if (newsData && newsData.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Force replace HTML5 audio with wave players
        replaceAllAudioElements();
        initializeAudioPlayers();
      }, 500);
    }
  }, [newsData]);

  // Function to replace only specific audio elements, not entire containers
  const replaceAllAudioElements = () => {
    // Look for H4 elements with filename + adjacent audio elements
    const h4Elements = document.querySelectorAll('h4');
    h4Elements.forEach(h4 => {
      if (h4.textContent.includes('🎵') && h4.textContent.includes('.mp3')) {
        // Find the next sibling audio element
        let nextElement = h4.nextElementSibling;
        while (nextElement && nextElement.tagName !== 'AUDIO') {
          nextElement = nextElement.nextElementSibling;
          if (!nextElement) break;
        }
        
        if (nextElement && nextElement.tagName === 'AUDIO') {
          const audio = nextElement;
          const src = audio.src || (audio.querySelector('source') ? audio.querySelector('source').src : '');
          
          if (src) {
            const wavePlayerHTML = `
              <div class="wave-audio-container" data-audio-src="${src}" style="margin: 20px 0;">
                <div style="background: linear-gradient(135deg, #FEF7ED 0%, #FEF3C7 100%); border-radius: 16px; padding: 20px; border: 2px solid #DC2626; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);">
                  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <button class="audio-play-btn" style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); border: none; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease;">
                      <span style="color: white; font-size: 16px;">▶</span>
                    </button>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #B91C1C; min-width: 100px;">
                      <span class="current-time">0:00</span>
                      <span style="opacity: 0.6;">/</span>
                      <span class="total-time" style="opacity: 0.8;">0:00</span>
                    </div>
                  </div>
                  <div class="wave-container" style="position: relative; height: 80px; background: #FFFFFF; border-radius: 8px; border: 1px solid #FED7D7; cursor: pointer; overflow: hidden; display: flex; align-items: end; gap: 2px; padding: 8px 4px;">
                    <div class="wave-progress" style="position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%); border-radius: 8px; transition: width 0.1s ease; z-index: 1;"></div>
                    ${Array.from({length: 50}, (_, i) => {
                      const height = Math.random() * 60 + 20;
                      return `<div style="width: 6px; height: ${height}%; background: linear-gradient(to top, #E5E7EB, #F3F4F6); border-radius: 3px; transition: all 0.3s ease; z-index: 2; position: relative;"></div>`;
                    }).join('')}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 12px; color: #B91C1C; opacity: 0.7;">
                    <span>Klik op de wave om door te spoelen</span>
                    <span class="progress-percentage">0%</span>
                  </div>
                </div>
                <audio class="hidden-audio" style="display: none;" preload="metadata">
                  <source src="${src}" type="audio/mpeg">
                </audio>
              </div>
            `;
            
            // Create container for the wave player
            const waveContainer = document.createElement('div');
            waveContainer.innerHTML = wavePlayerHTML;
            
            // Replace only the H4 and audio elements, not the entire parent
            h4.style.display = 'none';
            audio.style.display = 'none';
            
            // Insert wave player after the audio element
            audio.parentNode.insertBefore(waveContainer.firstElementChild, audio.nextSibling);
          }
        }
      }
    });
  };
  
  // Loading state - removed for instant display

  // Don't render anything until we're completely done loading and have verified we have data
  if (!initialized || loading || error || !newsData || (Array.isArray(newsData) && newsData.length === 0)) {
    return <div className="min-h-screen"></div>;
  }

  // If there's an ID in the URL, show single article
  if (id) {
    const article = newsData.find(item => item.id === id);
    
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
        
        {/* Footer - Sticky Bottom */}
        <footer className="mt-auto" style={{ background: '#FEF7ED', padding: '40px 0', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <Gift size={24} color="#DC2626" />
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#DC2626' }}>Sinterklaas Genk</span>
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>
              © 2025 Sinterklaas Genk. Alle rechten voorbehouden.
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.map((article) => (
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