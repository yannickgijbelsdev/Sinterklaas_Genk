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
          backgroundImage: `
            linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(96, 165, 250, 0.6) 100%),
            url('https://images.unsplash.com/photo-1545622783-b3e021430fee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/60 to-blue-700/50"></div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <h1 style={{
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: '900',
              color: 'white',
              textShadow: '3px 6px 12px rgba(0,0,0,0.5)',
              marginBottom: '24px',
              lineHeight: '1.1',
              fontFamily: '"Fredoka One", cursive'
            }}>
              JOUW EIGEN SINTERKLAAS
              <br />
              <span style={{ color: '#FDE047' }}>SHOW IN GENK</span>
            </h1>
            
            <p style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: '48px',
              fontWeight: '600',
              textShadow: '2px 4px 8px rgba(0,0,0,0.4)'
            }}>
              AL MEER DAN 15 JAAR EEN GROOT SUCCES!
            </p>
            
            <div className="flex flex-col items-start space-y-6">
              <button 
                className="group flex items-center space-x-4 px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(45deg, #FDE047, #FACC15)',
                  color: '#1F2937',
                  boxShadow: '0 8px 25px rgba(253, 224, 71, 0.4)'
                }}
                onClick={() => smoothScrollTo('#book')}
              >
                <Gift size={24} />
                <span>BOEK EEN SINTERKLAAS SHOW</span>
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Reviews */}
              <div className="flex items-center space-x-4 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#FDE047" color="#FDE047" />
                  ))}
                </div>
                <div className="text-white font-semibold">
                  4.9 • 500+ Tevreden Families
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s' }}>
          <div style={{ fontSize: '40px', opacity: 0.8, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>🎁</div>
        </div>
        <div className="absolute top-32 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
          <div style={{ fontSize: '35px', opacity: 0.7, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>⭐</div>
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce" style={{ animationDelay: '2s' }}>
          <div style={{ fontSize: '45px', opacity: 0.9, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>🎪</div>
        </div>
        
        {/* Simple Wave Shape Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-24" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,120 C300,60 900,60 1200,120 L1200,120 L0,120 Z" 
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Over Ons Section */}
      <section id="about" className="section section-dark section-padding">
        <div className="container">
          <div className="two-column">
            <div>
              <div className="eyebrow text-white">Over Sinterklaas Genk</div>
              <h2 className="text-white mb-8">{content.about_title || 'Wat maakt onze show zo speciaal?'}</h2>
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
      </section>

      {/* Speelse Golvende Separator Goud */}
      <div className="wavy-separator-gold"></div>

      {/* Shows Section - REMOVED */}

      {/* Waarom Section - REMOVED */}

      {/* Zachte Golvende Separator */}
      <div className="wavy-separator-soft"></div>

      {/* CTA Reserveer Section */}
      <section id="reserveer" className="section section-dark section-padding">
        <div className="container">
          <div className="card" style={{ background: 'var(--sinterklaas-rood-dark)', color: 'white', display: 'flex', alignItems: 'center', gap: '64px' }}>
            <div style={{ flex: 1 }}>
              <h2 className="text-white mb-8">Reserveer nu jullie magische Sinterklaasavond!</h2>
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
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section section-gold section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Veelgestelde Vragen</h2>
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
      </section>

      {/* Extra Speelse Golvende Separator */}
      <div className="wavy-separator"></div>

      {/* Nieuws Section */}
      <section id="news" className="section section-light section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Leuke Verhalen & Nieuws</h2>
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="section section-cream section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Neem Contact Op</h2>
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