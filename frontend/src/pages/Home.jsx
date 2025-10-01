import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gift, Star, Calendar, Clock, Users, Heart, Shield, Award, 
  CheckCircle, ArrowRight, Play, Download, Plus, Minus,
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube
} from 'lucide-react';
import { Button } from '../components/ui/button';
import '../styles/camp-buddy-theme.css';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [content, setContent] = useState({});
  const [news, setNews] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎅</div>
          <div className="text-xl">Website laden...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1545622783-b3e021430fee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <h1 style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: '400',
              textShadow: '3px 6px 12px rgba(0,0,0,0.8)',
              marginBottom: '24px',
              lineHeight: '1.1',
              fontFamily: '"Genty", cursive',
              textTransform: 'none'
            }}>
              <span style={{ color: '#DC2626' }}>Sint</span>
              <span style={{ color: 'white' }}>erklaas</span>
              <span style={{ color: '#DC2626' }}> en</span>
              <span style={{ color: 'white' }}> de</span>
              <br />
              <span style={{ color: '#DC2626' }}>Wens</span>
              <span style={{ color: 'white' }}>machine</span>
            </h1>
            
            {/* Subtitel en buttons verwijderd */}
          </div>
        </div>
        
        {/* Floating Elements - REMOVED */}
        
        {/* Wave Shape Bottom - Hero to About */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-24" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,120 C300,60 900,60 1200,120 L1200,120 L0,120 Z" 
              style={{ fill: '#DC2626' }}
            ></path>
          </svg>
        </div>
      </section>

      {/* Over Ons Section */}
      <section 
        id="about" 
        className="section section-padding relative"
        style={{ backgroundColor: '#DC2626', color: 'white' }}
      >
        <div className="container">
          <div className="two-column">
            <div>
              <div className="eyebrow text-white">Over Sinterklaas Genk</div>
              <h2 className="genty-regular text-white mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {content.about_title || 'Wat maakt onze show zo speciaal?'}
              </h2>
              <p className="text-white mb-8" style={{ opacity: 0.9 }}>
                Al meer dan 15 jaar brengen wij de magie van Sinterklaas tot leven in Genk. 
                Onze interactieve shows zorgen ervoor dat elk kind zich de hoofdpersoon voelt 
                van dit magische verhaal.
              </p>
              <button className="btn btn-outline-white">
                Leer meer over ons
                <ArrowRight size={20} />
              </button>
            </div>
            
            <div>
              <div className="card card-white" style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '80px', textAlign: 'center', color: '#DC2626' }}>
                  🎭
                  <div style={{ fontSize: '16px', marginTop: '16px', color: '#666' }}>
                    Professionele Sinterklaas Shows
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Show Highlight Card */}
          <div className="mt-16">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '32px', background: 'var(--warm-white)' }}>
              <div style={{ flex: 1 }}>
                <div className="sinterklaas-badge">Populairste Show</div>
                <h3 style={{ marginBottom: '16px', color: 'var(--sinterklaas-rood)' }}>De Grote Sinterklaasavond</h3>
                <p style={{ marginBottom: '24px', color: '#666' }}>
                  Onze meest uitgebreide show vol interactie, verrassingen en natuurlijk 
                  een bezoek van de échte Sinterklaas met zijn Pieten. Perfect voor het hele gezin!
                </p>
                <button className="btn btn-primary">
                  Reserveer nu
                </button>
              </div>
              <div style={{ 
                width: '200px', 
                height: '150px', 
                background: 'linear-gradient(135deg, var(--sinterklaas-goud-light) 0%, var(--sinterklaas-goud) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                🎭🎪
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Shape Bottom - About to Reserveer */}
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

      {/* Speelse Golvende Separator Goud */}
      <div className="wavy-separator-gold"></div>

      {/* Shows Section - REMOVED */}

      {/* Waarom Section - REMOVED */}

      {/* Zachte Golvende Separator */}
      <div className="wavy-separator-soft"></div>

      {/* CTA Reserveer Section */}
      <section id="reserveer" className="section section-dark section-padding relative">
        <div className="container">
          <div className="card" style={{ background: 'var(--sinterklaas-rood-dark)', color: 'white', display: 'flex', alignItems: 'center', gap: '64px' }}>
            <div style={{ flex: 1 }}>
              <h2 className="genty-regular text-white mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Reserveer nu jullie magische Sinterklaasavond!
              </h2>
              <p className="text-white mb-8" style={{ opacity: 0.9 }}>
                Wacht niet te lang - onze populaire data zijn snel uitverkocht. Zorg dat jullie gezin bij dit magische gebeuren kan zijn!
              </p>
              <button className="btn btn-secondary">
                <Calendar size={20} />
                Reserveer Direct
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
              🗓️✨
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
              style={{ fill: '#FBBF24' }}
            ></path>
          </svg>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section section-gold section-padding relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="genty-regular" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#DC2626' }}>
              Veelgestelde Vragen
            </h2>
            <p style={{ fontSize: '20px', color: '#666' }}>
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
                    background: 'none',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: 'var(--body-size)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{item.question}</span>
                  {openFaq === index ? <Minus size={20} color="#DC2626" /> : <Plus size={20} color="#DC2626" />}
                </button>
                {openFaq === index && (
                  <div style={{ padding: '0 24px 24px', color: '#666' }}>
                    <p>{item.answer}</p>
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
      <section id="news" className="section section-light section-padding relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="genty-regular" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#DC2626' }}>
              Leuke Verhalen & Nieuws
            </h2>
            <p style={{ fontSize: '20px', color: '#666' }}>
              Blijf op de hoogte van alle nieuwtjes en verhalen rondom Sinterklaas Genk.
            </p>
          </div>
          
          <div className="three-column">
            {blogPosts.slice(0, 3).map((post, index) => (
              <div key={post.id || index} className="card" style={{ overflow: 'hidden', padding: '0' }}>
                <div style={{
                  height: '200px',
                  background: post.image ? 'transparent' : 'linear-gradient(135deg, var(--sinterklaas-goud-light) 0%, var(--sinterklaas-goud) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  position: 'relative'
                }}>
                  {post.image ? (
                    <img 
                      src={post.image} 
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
        </div>
        
        {/* Wave Shape Bottom - News to Contact */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-24" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,120 C300,60 900,60 1200,120 L1200,120 L0,120 Z" 
              style={{ fill: '#DC2626' }}
            ></path>
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section section-cream section-padding relative" style={{ backgroundColor: '#DC2626', color: 'white' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="genty-regular" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white' }}>
              Neem Contact Op
            </h2>
            <p style={{ fontSize: '20px', color: '#666', marginBottom: '48px' }}>
              Vragen over onze shows? We helpen jullie graag verder!
            </p>
          </div>

          <div className="three-column mb-12">
            <div className="card text-center">
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'var(--sinterklaas-rood)', 
                borderRadius: '50%', 
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone size={28} color="white" />
              </div>
              <h3 style={{ fontWeight: '600', marginBottom: '12px' }}>Bel Ons</h3>
              <p style={{ color: '#666' }}>{content.phone || '+32 (0)89 123 456'}</p>
            </div>

            <div className="card text-center">
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'var(--sinterklaas-goud)', 
                borderRadius: '50%', 
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail size={28} color="white" />
              </div>
              <h3 style={{ fontWeight: '600', marginBottom: '12px' }}>Email Ons</h3>
              <p style={{ color: '#666' }}>{content.email || 'info@sinterklaasgenk.be'}</p>
            </div>

            <div className="card text-center">
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'var(--sinterklaas-rood-dark)', 
                borderRadius: '50%', 
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={28} color="white" />
              </div>
              <h3 style={{ fontWeight: '600', marginBottom: '12px' }}>Locatie</h3>
              <div style={{ color: '#666' }}>
                {content.address ? 
                  content.address.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  )) : 
                  <>
                    <div>Cultureel Centrum Genk</div>
                    <div>Dieplaan 17, 3600 Genk</div>
                  </>
                }
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button className="btn btn-primary" style={{ fontSize: '18px', padding: '20px 40px' }}>
              <Gift size={24} />
              Reserveer Nu Jullie Tickets
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--warm-cream)', padding: '64px 0 32px' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', 
            gap: '48px', 
            marginBottom: '48px' 
          }}>
            <div style={{ maxWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Gift size={28} color="#DC2626" />
                <span style={{ fontSize: '24px', fontWeight: '700' }}>Sinterklaas Genk</span>
              </div>
              <p style={{ marginBottom: '24px' }}>
                Al meer dan 15 jaar de meest magische Sinterklaasshows van België. 
                Voor onvergetelijke herinneringen van het hele gezin.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <input 
                  type="email" 
                  placeholder="Jouw email adres" 
                  style={{ 
                    flex: 1, 
                    padding: '12px 16px', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px', 
                    fontSize: '14px' 
                  }} 
                />
                <button className="btn btn-primary" style={{ padding: '12px 20px' }}>
                  Inschrijven
                </button>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--sinterklaas-rood)' }}>
                Shows
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Sinterklaasavond</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Schoolshows</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Privé Events</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Groepsarrangementen</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--sinterklaas-rood)' }}>
                Info
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Over Ons</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Het Team</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Locaties</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Contact</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--sinterklaas-rood)' }}>
                Service
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Klantenservice</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Veelgestelde Vragen</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Tickets Omruilen</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Groepskortingen</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--sinterklaas-rood)' }}>
                Volg Ons
              </h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  background: '#F3F4F6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <Facebook size={20} />
                </a>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  background: '#F3F4F6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <Instagram size={20} />
                </a>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  background: '#F3F4F6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div style={{ 
            paddingTop: '32px', 
            borderTop: '1px solid #E5E7EB', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            color: '#666', 
            fontSize: '14px' 
          }}>
            <div>© 2024 Sinterklaas Genk. Alle rechten voorbehouden.</div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Voorwaarden</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}