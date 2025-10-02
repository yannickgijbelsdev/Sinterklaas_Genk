import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gift, Star, Calendar, Clock, Users, Heart, Shield, Award, 
  CheckCircle, ArrowRight, Play, Download, Plus, Minus, X,
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube
} from 'lucide-react';
import { Button } from '../components/ui/button';
import AdvancedLiveEditor from '../components/AdvancedLiveEditor';
import { useAuth } from '../contexts/AuthContext';
import { useLiveEditor } from '../contexts/LiveEditorContext';
import '../styles/camp-buddy-theme.css';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [content, setContent] = useState({});
  const [news, setNews] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [newsDisplayCount, setNewsDisplayCount] = useState(3);
  const [loadingMoreNews, setLoadingMoreNews] = useState(false);
  const [isLiveEditing, setIsLiveEditing] = useState(false);

  const { isAuthenticated, isAdmin } = useAuth();

  // Smooth scroll function
  const smoothScrollTo = (elementId) => {
    const element = document.querySelector(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch content data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, newsRes, showsRes] = await Promise.all([
          fetch(`${API}/admin/content`),
          fetch(`${API}/news`),
          fetch(`${API}/admin/shows`)
        ]);

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          // Convert array to object for easier access
          const contentObj = {};
          contentData.forEach(item => {
            contentObj[item.id] = item.value;
          });
          setContent(contentObj);
        }

        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(newsData.slice(0, 3)); // Get latest 3 articles
        }

        if (showsRes.ok) {
          const showsData = await showsRes.json();
          setShows(showsData.slice(0, 5)); // Get next 5 shows
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Background video handling
  useEffect(() => {
    const backgroundVideo = document.querySelector('#hero video');
    if (backgroundVideo) {
      // Ensure video plays and is muted
      backgroundVideo.muted = true;
      backgroundVideo.play().catch(err => {
        console.log('Background video autoplay prevented:', err);
      });
    }
  }, []);

  // Function to load more news
  const loadMoreNews = () => {
    setLoadingMoreNews(true);
    // Simulate loading delay
    setTimeout(() => {
      setNewsDisplayCount(prev => prev + 3);
      setLoadingMoreNews(false);
    }, 1000);
  };

  const faqItems = [
    {
      question: "Hoe garandeer jullie de veiligheid tijdens shows?",
      answer: "Al onze shows worden uitgevoerd door ervaren acteurs met achtergrondcontroles. We hanteren strikte veiligheidsprotocollen en hebben altijd EHBO-gekwalificeerde medewerkers aanwezig."
    },
    {
      question: "Wat is inbegrepen in de ticketprijs?",
      answer: "Ticketprijzen omvatten de volledige show, interactie met Sinterklaas en Pieten, cadeautjes voor kinderen, en drankje en koekje tijdens de pauze. Parkeren is gratis."
    },
    {
      question: "Kunnen we tickets terugbetaald krijgen?",
      answer: "Bij annulering tot 7 dagen voor de show bieden we volledige terugbetaling. In geval van ziekte of noodgevallen bekijken we elk geval individueel."
    },
    {
      question: "Is de show geschikt voor kinderen met speciale behoeften?",
      answer: "Absoluut! We hebben ervaring met inclusieve voorstellingen. Neem contact op bij het boeken zodat we rekening kunnen houden met specifieke behoeften."
    },
    {
      question: "Hoe lang duurt de show?",
      answer: "Onze shows duren ongeveer 75 minuten inclusief een korte pauze. Dit is de perfecte lengte om kinderen betrokken te houden zonder dat ze moe worden."
    },
    {
      question: "Kunnen we foto's maken tijdens de show?",
      answer: "Ja! Tijdens de show mogen foto's gemaakt worden. Na afloop is er altijd gelegenheid voor een meet & greet met Sinterklaas en de Pieten."
    },
    {
      question: "Waar vinden de shows plaats?",
      answer: "Onze hoofdlocatie is in het cultureel centrum van Genk. Voor groepsboekingen kunnen we ook naar uw locatie komen (scholen, bedrijven, etc.)."
    },
    {
      question: "Zijn er kortingen voor grote groepen?",
      answer: "Ja, vanaf 20 personen bieden we groepskortingen. Scholen en verenigingen krijgen ook speciale tarieven. Neem contact op voor meer informatie."
    }
  ];

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Achter de Schermen': '🎭',
      'Tips & Tricks': '💡', 
      'Tips voor Ouders': '👶',
      'Tradities': '📚',
      'Algemeen': '📰',
      'Show Nieuws': '🎪',
      'Evenementen': '🎉',
      'Interviews': '🎤'
    };
    return iconMap[category] || '📰';
  };

  // Use real news data with fallback to demo data - using useMemo to ensure re-computation when news changes
  const blogPosts = useMemo(() => {
    if (news.length > 0) {
      return news.map(article => ({
        id: article.id,
        category: article.category || 'Algemeen',
        title: article.title,
        excerpt: article.excerpt,
        date: new Date(article.date).toLocaleDateString('nl-NL'),
        readTime: '3 min lezen', // Default reading time
        icon: getCategoryIcon(article.category || 'Algemeen'),
        image: article.featured_image || article.image
      }));
    } else {
      return [
        {
          id: 'demo-1',
          category: "Achter de Schermen",
          title: "Zo bereiden onze acteurs zich voor op het Sinterklaas seizoen",
          excerpt: "Een kijkje achter de schermen bij de voorbereidingen voor de magische Sinterklaasshow...",
          date: "15 november 2024",
          readTime: "3 min lezen",
          icon: "🎭"
        },
        {
          id: 'demo-2',
          category: "Tips voor Ouders", 
          title: "Hoe bereid je je kind voor op de eerste Sinterklaasshow?",
          excerpt: "Praktische tips om ervoor te zorgen dat je kind optimaal kan genieten van de magische ervaring...",
          date: "10 november 2024",
          readTime: "4 min lezen",
          icon: "👶"
        },
        {
          id: 'demo-3',
          category: "Tradities",
          title: "De geschiedenis van Sinterklaas in Genk",
          excerpt: "Ontdek hoe de Sinterklaas traditie is gegroeid in onze mooie stad en wat dit betekent voor families...",
          date: "5 november 2024", 
          readTime: "5 min lezen",
          icon: "📚"
        }
      ];
    }
  }, [news]);

  // Loader removed - direct rendering

  return (
    <div>
      
      {/* Hero Section with Video Background & Trailer Button */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Video Background - Silent & Looping */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            zIndex: 1
          }}
          onContextMenu={(e) => e.preventDefault()}
          data-edit-id="hero_background_video"
        >
          <source 
            src="https://customer-assets.emergentagent.com/job_festive-dashboard-1/artifacts/ynr147fs_trailer%20zonder%20OT.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Fallback image if video doesn't load */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://customer-assets.emergentagent.com/job_festive-dashboard-1/artifacts/hgbl7vik_MRTN1539.jpg')`,
            zIndex: 0
          }}
        ></div>
        
        {/* Subtle overlay for content readability */}
        <div className="absolute inset-0 bg-black/10" style={{ zIndex: 2 }}></div>
        
        {/* Partner Logos Banner - Bottom Left */}
        <div 
          className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg"
          style={{ zIndex: 10 }}
        >
          <div className="flex items-center gap-6">
            <span className="text-base text-gray-700 font-medium whitespace-nowrap">Partners:</span>
            <div className="flex items-center gap-4">
              {/* Genk Logo */}
              <img 
                src="https://customer-assets.emergentagent.com/job_festive-dashboard-1/artifacts/m50ye00m_GENK-LOGO-SCREEN-POSITIEF-RGB.png"
                alt="Genk Logo"
                className="h-16 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity duration-200"
              />
              {/* RC Genk Logo */}
              <img 
                src="https://customer-assets.emergentagent.com/job_festive-dashboard-1/artifacts/v8z8d4ru_Logo-RC-Genk-1.jpg"
                alt="RC Genk Logo"
                className="h-16 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity duration-200"
              />
              {/* SW 2025 Logo */}
              <img 
                src="https://customer-assets.emergentagent.com/job_festive-dashboard-1/artifacts/tk3ymnog_SW-2025-LOGO-RGB.png"
                alt="SW 2025 Logo"
                className="h-16 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </div>
        </div>

        {/* View Trailer Button - Bottom Right */}
        <button 
          onClick={() => setShowTrailerModal(true)}
          className="absolute bottom-20 right-12 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl flex items-center font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl backdrop-blur-sm"
          style={{ zIndex: 20 }}
          data-edit-id="trailer_button_text"
        >
          <Play size={24} className="mr-3" fill="white" />
          Bekijk de trailer
        </button>
        
        {/* Floating Elements - REMOVED */}
        
        {/* Wave Shape Bottom - Hero to Reserveer */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-24" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,120 C300,60 900,60 1200,120 L1200,120 L0,120 Z" 
              style={{ fill: '#B91C1C' }}
            ></path>
          </svg>
        </div>
      </section>

      {/* Over Ons Section - REMOVED */}

      {/* Shows Section - REMOVED */}

      {/* Waarom Section - REMOVED */}

      {/* CTA Reserveer Section */}
      <section 
        id="reserveer" 
        className="section section-padding relative" 
        style={{ backgroundColor: '#B91C1C' }}
        data-section-id="reserveer_section"
      >
        <div className="container">
          <div className="card" style={{ background: '#DC2626', color: 'white', display: 'flex', alignItems: 'center', gap: '64px' }}>
            <div style={{ flex: 1 }}>
              <h2 
                className="genty-regular text-white mb-8" 
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                data-edit-id="reserveer_title"
              >
                Reserveer nu jullie magische Sinterklaasavond!
              </h2>
              <p 
                className="text-white mb-8" 
                style={{ opacity: 0.9 }}
                data-edit-id="reserveer_description"
              >
                Wacht niet te lang - onze populaire data zijn snel uitverkocht. Zorg dat jullie gezin bij dit magische gebeuren kan zijn!
              </p>
              <button 
                className="btn btn-secondary"
                onClick={() => window.open('https://events.flextickets.nl/event/sinterklaas-en-de-wensmachine', '_blank')}
              >
                <Calendar size={20} />
                Bestel nu je tickets
              </button>
            </div>
            <div style={{
              width: '300px',
              height: '200px',
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px'
            }}>
              <img 
                src="https://customer-assets.emergentagent.com/job_festive-dashboard-1/artifacts/tf62t3u6_MRTN1802.jpg" 
                alt="Sinterklaas karakter" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Wave Shape Bottom - Reserveer to FAQ */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-24" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,120 C300,60 900,60 1200,120 L1200,120 L0,120 Z" 
              style={{ fill: '#FFF5F5' }}
            ></path>
          </svg>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        id="faq" 
        className="section section-padding relative" 
        style={{ backgroundColor: '#FFF5F5' }}
        data-section-id="faq_section"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 
              className="genty-regular" 
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#B91C1C' }}
              data-edit-id="faq_title"
            >
              Veelgestelde Vragen
            </h2>
            <p 
              style={{ fontSize: '20px', color: '#374151' }}
              data-edit-id="faq_subtitle"
            >
              Antwoorden op de meest gestelde vragen over onze Sinterklaasshows.
            </p>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqItems.map((item, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'active' : ''}`} style={{ marginBottom: '16px' }}>
                <button 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  style={{ 
                    padding: '24px',
                    border: 'none',
                    background: 'white',
                    borderRadius: '12px',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: 'var(--body-size)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#1F2937',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span data-edit-id={`faq_question_${index}`}>{item.question}</span>
                  {openFaq === index ? <Minus size={20} color="#B91C1C" /> : <Plus size={20} color="#B91C1C" />}
                </button>
                {openFaq === index && (
                  <div style={{ padding: '20px 24px 24px', color: '#374151', background: 'white', marginTop: '2px', borderRadius: '0 0 12px 12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                    <p 
                      style={{ lineHeight: '1.7' }}
                      data-edit-id={`faq_answer_${index}`}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Wave Shape Bottom - FAQ to News */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-24" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,120 C300,60 900,60 1200,120 L1200,120 L0,120 Z" 
              style={{ fill: '#FEF3C7' }}
            ></path>
          </svg>
        </div>
      </section>

      {/* Nieuws Section */}
      <section 
        id="news" 
        className="section section-padding relative" 
        style={{ backgroundColor: '#FEF3C7' }}
        data-section-id="news_section"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 
              className="genty-regular" 
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#DC2626' }}
              data-edit-id="news_title"
            >
              Leuke Verhalen & Nieuws
            </h2>
            <p 
              style={{ fontSize: '20px', color: '#666' }}
              data-edit-id="news_subtitle"
            >
              Blijf op de hoogte van alle nieuwtjes en verhalen rondom Sinterklaas Genk.
            </p>
          </div>
          
          <div className="three-column">
            {blogPosts.slice(0, newsDisplayCount).map((post, index) => (
              <div key={post.id || index} className="card" style={{ overflow: 'hidden', padding: '0' }}>
                <div style={{
                  height: '200px',
                  background: post.image ? 'transparent' : '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  position: 'relative'
                }}>
                  {post.image ? (
                    <img 
                      src={post.image.startsWith('http') ? post.image : `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}${post.image}`} 
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span>{post.icon || '📰'}</span>
                  )}
                </div>
                <div style={{ padding: '24px' }}>
                  <div className="sinterklaas-badge" style={{ marginBottom: '16px' }}>
                    {post.category || 'Nieuws'}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', lineHeight: '1.3' }}>
                    {post.title}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '16px' }}>{post.excerpt}</p>
                  <a href={post.id && post.id.startsWith('demo-') ? '#' : `/news/${post.id}`} style={{ color: 'var(--sinterklaas-rood)', textDecoration: 'none', fontWeight: '600' }}>
                    Lees meer →
                  </a>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#999', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: '16px', 
                    paddingTop: '16px', 
                    borderTop: '1px solid #E5E7EB' 
                  }}>
                    <span>{post.date}</span>
                    <span>{post.readTime || '3 min lezen'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More News Button */}
          {blogPosts.length > newsDisplayCount && (
            <div className="text-center mt-12">
              <button
                onClick={loadMoreNews}
                disabled={loadingMoreNews}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
                style={{ fontSize: '16px' }}
              >
                {loadingMoreNews ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Nieuws laden...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Meer nieuws laden
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Wave Shape Bottom - REMOVED */}
      </section>

      {/* Contact Section - REMOVED */}

      {/* Simple Footer */}
      <footer 
        style={{ background: '#FEF7ED', padding: '40px 0', textAlign: 'center' }}
        data-section-id="footer_section"
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Gift size={24} color="#DC2626" />
            <span 
              style={{ fontSize: '20px', fontWeight: '700', color: '#DC2626' }}
              data-edit-id="footer_title"
            >
              Sinterklaas Genk
            </span>
          </div>
          <p 
            style={{ color: '#666', fontSize: '14px' }}
            data-edit-id="footer_copyright"
          >
            © 2025 Sinterklaas Genk. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowTrailerModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl mx-4 bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 z-10 transition-all duration-200"
            >
              <X size={24} />
            </button>
            
            {/* Video Player */}
            <video
              autoPlay
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              className="w-full h-auto"
              style={{ maxHeight: '80vh' }}
              onContextMenu={(e) => e.preventDefault()}
              data-edit-id="trailer_modal_video"
              onEnded={() => {
                // Video ends, don't loop
                console.log('Trailer finished playing');
              }}
            >
              <source 
                src="https://customer-assets.emergentagent.com/job_festive-dashboard-1/artifacts/mgim5w9w_trailer%20met%20OT.mp4" 
                type="video/mp4" 
              />
              <p className="text-white p-4">
                Uw browser ondersteunt geen video afspelen. 
                <a 
                  href="https://customer-assets.emergentagent.com/job_festive-dashboard-1/artifacts/mgim5w9w_trailer%20met%20OT.mp4" 
                  className="text-red-400 underline ml-1"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download de trailer hier
                </a>
              </p>
            </video>
            
            {/* Modal Footer */}
            <div className="bg-gray-900 text-white p-4 text-center">
              <h3 
                className="text-xl font-bold mb-2"
                data-edit-id="trailer_modal_title"
              >
                Sinterklaas en de Wensmachine
              </h3>
              <p 
                className="text-gray-300"
                data-edit-id="trailer_modal_description"
              >
                Beleef de magie van onze interactieve Sinterklaas show
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Editor Component */}
      {isAuthenticated() && isAdmin() && (
        <LiveEditor 
          isEnabled={isLiveEditing}
          onToggle={() => setIsLiveEditing(!isLiveEditing)}
        />
      )}

    </div>
  );
}