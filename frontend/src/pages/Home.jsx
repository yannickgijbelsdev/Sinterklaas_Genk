import React, { useState, useEffect } from 'react';
import { 
  Gift, Star, Calendar, Clock, Users, Heart, Shield, Award, 
  CheckCircle, ArrowRight, Play, Download, Plus, Minus,
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube,
  X, Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import '../styles/camp-buddy-theme.css';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [activePopup, setActivePopup] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll-based animations and progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Reveal elements as we scroll
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight * 0.8) {
          element.classList.add('revealed');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProgressEmoji = () => {
    if (scrollProgress < 16) return '⚓'; // Boeg
    if (scrollProgress < 32) return '🚢'; // Stuurhut  
    if (scrollProgress < 48) return '🎭'; // Theater
    if (scrollProgress < 64) return '⚙️'; // Machinekamer
    if (scrollProgress < 80) return '🏠'; // Kajuiten
    return '🏁'; // Finish
  };

  const verhaalElementen = {
    anker: {
      title: "Het Anker van Hoop",
      content: "Dit magische anker zorgt ervoor dat de stoomboot van Sinterklaas altijd veilig in de haven van Genk aankomt. Kinderen geloven dat het anker gemaakt is van sterren!"
    },
    stuurwiel: {
      title: "Sinterklaas' Stuurwiel",
      content: "Met dit gouden stuurwiel navigeert Sinterklaas door de wolken naar alle brave kinderen. Het draait alleen voor echte Sinterklaas magie!"
    },
    gordijn: {
      title: "Magische Theater Gordijnen",
      content: "Achter deze gordijnen bereiden de Pieten de geweldige shows voor. Soms kun je ze zachtjes horen oefenen!"
    },
    machine: {
      title: "Cadeau-Maak Machine",
      content: "Deze magische machines maken alle cadeautjes voor de kinderen. Ze werken op vrolijkheid en Sinterklaas liedjes!"
    },
    raam: {
      title: "Piet's Uitkijkpost",
      content: "Vanuit deze ramen houden de Pieten de omgeving in de gaten en zwaaien naar alle kinderen die langslopen!"
    },
    vlag: {
      title: "De Vlag van Genk",
      content: "Deze speciale vlag laat iedereen weten dat Sinterklaas in Genk is aangekomen voor de meest magische shows!"
    }
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

  const blogPosts = [
    {
      category: "Achter de Schermen",
      title: "Zo bereiden onze acteurs zich voor op het Sinterklaas seizoen",
      excerpt: "Een kijkje achter de schermen bij de voorbereidingen voor de magische Sinterklaasshow...",
      date: "15 november 2024",
      readTime: "3 min lezen",
      icon: "🎭"
    },
    {
      category: "Tips voor Ouders", 
      title: "Hoe bereid je je kind voor op de eerste Sinterklaasshow?",
      excerpt: "Praktische tips om ervoor te zorgen dat je kind optimaal kan genieten van de magische ervaring...",
      date: "10 november 2024",
      readTime: "4 min lezen",
      icon: "👶"
    },
    {
      category: "Tradities",
      title: "De geschiedenis van Sinterklaas in Genk",
      excerpt: "Ontdek hoe de Sinterklaas traditie is gegroeid in onze mooie stad en wat dit betekent voor families...",
      date: "5 november 2024", 
      readTime: "5 min lezen",
      icon: "📚"
    }
  ];

  return (
    <div>
      {/* Stoomboot Progress Indicator */}
      <div className="stoomboot-progress">
        {getProgressEmoji()}
      </div>

      {/* Popup Overlay */}
      <div 
        className={`popup-overlay ${activePopup ? 'active' : ''}`}
        onClick={() => setActivePopup(null)}
      />
      
      {/* Verhaal Popup */}
      {activePopup && (
        <div className="verhaal-popup active">
          <button 
            onClick={() => setActivePopup(null)}
            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
          <h3 style={{ color: 'var(--sinterklaas-rood)', marginBottom: '16px' }}>
            {verhaalElementen[activePopup]?.title}
          </h3>
          <p>{verhaalElementen[activePopup]?.content}</p>
        </div>
      )}

      {/* Authentieke Boeg/Voorplecht - Hero Section */}
      <section id="hero" className="stoomboot-section stoomboot-boeg">
        <div className="authentiek-anker"></div>
        <div className="container">
          {/* Professionele Sinterklaas Character */}
          <div 
            className="sinterklaas-character verhaal-element"
            style={{ 
              top: '25%', 
              left: '12%', 
              fontSize: '90px',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
              textShadow: '0 5px 15px rgba(0,0,0,0.6)'
            }}
            onClick={() => setActivePopup('anker')}
            title="Klik voor het verhaal van het anker!"
          >
            🎅
          </div>
          
          {/* Elegante Piet Characters */}
          <div 
            className="piet-character verhaal-element"
            style={{ 
              top: '35%', 
              right: '25%',
              fontSize: '70px',
              filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.4))'
            }}
            onClick={() => setActivePopup('anker')}
          >
            👨‍🦱
          </div>
          <div 
            className="piet-character verhaal-element"
            style={{ 
              bottom: '25%', 
              left: '20%',
              fontSize: '70px',
              filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.4))'
            }}
            onClick={() => setActivePopup('anker')}
          >
            👩‍🦱
          </div>

          <div className="scroll-reveal" style={{ textAlign: 'center', color: 'white', zIndex: 5, position: 'relative' }}>
            <div style={{ 
              fontSize: '28px', 
              marginBottom: '25px', 
              opacity: 0.95,
              textShadow: '0 4px 15px rgba(0,0,0,0.7)',
              fontFamily: 'Playfair Display, serif',
              fontWeight: '700'
            }}>
              ⚓ Welkom aan boord van de S.S. Sinterklaas ⚓
            </div>
            <h1 style={{ 
              color: 'white', 
              marginBottom: '35px',
              textShadow: '0 6px 20px rgba(0,0,0,0.8)',
              fontSize: '52px',
              fontFamily: 'Playfair Display, serif'
            }}>
              De Magische Sinterklaas Stoomboot
            </h1>
            <p style={{ 
              fontSize: '24px', 
              marginBottom: '45px', 
              maxWidth: '700px', 
              margin: '0 auto 45px',
              textShadow: '0 3px 10px rgba(0,0,0,0.6)',
              lineHeight: 1.7,
              fontWeight: '400'
            }}>
              Stap aan boord van Sinterklaas' luxueuze stoomboot en ontdek elke ruimte vol verrassingen! 
              Een reis door authentieke scheepsruimtes...
            </p>
            <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ 
                fontSize: '18px', 
                padding: '18px 35px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}>
                🎫 Kom Aan Boord
              </button>
              <button className="btn btn-secondary" style={{ 
                fontSize: '18px', 
                padding: '18px 35px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}>
                📅 Show Schema
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Luxe Kapiteinsbrug/Stuurhut - About Section */}
      <section id="about" className="stoomboot-section stoomboot-stuurhut">
        <div className="stuurhut-instrumentenpaneel">
          <div className="instrument-meter">
            <div className="meter-naald"></div>
          </div>
          <div className="instrument-meter">
            <div className="meter-naald" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="instrument-meter">
            <div className="meter-naald" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="instrument-meter">
            <div className="meter-naald" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
        
        <div className="container">
          {/* Professioneel Stuurwiel Interactief Element */}
          <div 
            className="professioneel-stuurwiel verhaal-element"
            onClick={() => setActivePopup('stuurwiel')}
            title="Klik op het stuurwiel voor het verhaal!"
          >
            <div className="stuurwiel-spaak"></div>
            <div className="stuurwiel-spaak"></div>
            <div className="stuurwiel-spaak"></div>
            <div className="stuurwiel-spaak"></div>
            <div className="stuurwiel-spaak"></div>
            <div className="stuurwiel-spaak"></div>
            <div className="stuurwiel-spaak"></div>
            <div className="stuurwiel-spaak"></div>
            <div className="stuurwiel-hub"></div>
          </div>
          
          {/* Elegante Kapitein Sinterklaas */}
          <div 
            className="sinterklaas-character"
            style={{ 
              top: '45%', 
              right: '25%', 
              fontSize: '80px',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))'
            }}
          >
            🎅
          </div>

          <div className="scroll-reveal" style={{ color: 'white', maxWidth: '750px', zIndex: 3, position: 'relative' }}>
            <div style={{ 
              fontSize: '22px', 
              marginBottom: '20px', 
              opacity: 0.9,
              textShadow: '0 3px 10px rgba(0,0,0,0.8)',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic'
            }}>
              🧭 Vanaf de Kapiteinsbrug
            </div>
            <h2 style={{ 
              color: 'white', 
              marginBottom: '35px',
              textShadow: '0 5px 15px rgba(0,0,0,0.8)',
              fontFamily: 'Playfair Display, serif',
              fontSize: '42px'
            }}>
              Kapitein Sinterklaas navigeert naar Genk
            </h2>
            <p style={{ 
              fontSize: '22px', 
              marginBottom: '35px', 
              lineHeight: 1.8,
              textShadow: '0 2px 8px rgba(0,0,0,0.7)'
            }}>
              Vanuit deze luxueuze kapiteinsbrug bestuurt Sinterklaas zijn historische stoomboot door de wolken. 
              Met precisie-instrumenten en jarenlange ervaring vaart hij al meer dan 15 jaar naar Genk om de meest 
              interactieve en magische shows te brengen!
            </p>
            <div style={{ 
              background: 'rgba(218, 165, 32, 0.15)', 
              padding: '25px', 
              borderRadius: '20px', 
              marginBottom: '35px',
              border: '2px solid rgba(218, 165, 32, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ 
                color: 'var(--sinterklaas-goud-light)', 
                marginBottom: '18px',
                fontSize: '24px',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
              }}>
                ⭐ Kapitein Sinterklaas vertelt:
              </h3>
              <p style={{ 
                fontStyle: 'italic', 
                fontSize: '20px', 
                lineHeight: 1.6,
                textShadow: '0 2px 6px rgba(0,0,0,0.7)'
              }}>
                "Elk kind dat onze stoomboot betreedt, wordt onderdeel van mijn bemanning! 
                Samen maken we van elke voorstelling een onvergetelijke zeereis vol magie."
              </p>
            </div>
            <button className="btn btn-secondary" style={{ 
              fontSize: '18px', 
              padding: '16px 30px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
            }}>
              Ontmoet de Bemanning
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </section>

      {/* Luxe Theater/Salon - Shows Section */}
      <section id="shows" className="stoomboot-section stoomboot-theater">
        <div className="theater-gordijnen-systeem">
          <div className="gordijn-ring"></div>
          <div className="gordijn-ring"></div>
          <div className="gordijn-ring"></div>
          <div className="gordijn-ring"></div>
          <div className="gordijn-ring"></div>
          <div className="gordijn-ring"></div>
          <div className="gordijn-ring"></div>
          <div className="gordijn-ring"></div>
          <div className="gordijn-ring"></div>
          <div 
            className="verhaal-element"
            style={{ 
              position: 'absolute', 
              top: '25px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              fontSize: '35px',
              cursor: 'pointer',
              filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.8))'
            }}
            onClick={() => setActivePopup('gordijn')}
            title="Klik op de theater gordijnen!"
          >
            🎭
          </div>
        </div>
        
        <div className="theater-verlichting-systeem">
          <div className="professionele-spotlight">
            <div className="spotlight-lens"></div>
            <div className="spotlight-straal"></div>
          </div>
          <div className="professionele-spotlight" style={{ animationDelay: '1s' }}>
            <div className="spotlight-lens"></div>
            <div className="spotlight-straal"></div>
          </div>
          <div className="professionele-spotlight" style={{ animationDelay: '2s' }}>
            <div className="spotlight-lens"></div>
            <div className="spotlight-straal"></div>
          </div>
        </div>
        
        <div className="theater-balkon links">
          <div className="balkon-reling"></div>
        </div>
        <div className="theater-balkon rechts">
          <div className="balkon-reling"></div>
        </div>
        
        <div className="theater-podium"></div>
        
        <div className="container" style={{ marginTop: '120px', zIndex: 10, position: 'relative' }}>
          {/* Elegante Sinterklaas op het podium */}
          <div 
            className="sinterklaas-character"
            style={{ 
              top: '20%', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              fontSize: '100px',
              filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.8))',
              textShadow: '0 8px 20px rgba(0,0,0,0.9)'
            }}
          >
            🎅
          </div>
          
          {/* Elegante Pieten aan weerszijden */}
          <div 
            className="piet-character" 
            style={{ 
              top: '30%', 
              left: '25%', 
              fontSize: '75px',
              filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.7))'
            }}
          >
            👨‍🦱
          </div>
          <div 
            className="piet-character" 
            style={{ 
              top: '30%', 
              right: '25%', 
              fontSize: '75px',
              filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.7))'
            }}
          >
            👩‍🦱
          </div>

          <div className="scroll-reveal" style={{ textAlign: 'center', color: 'white', marginTop: '140px' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '20px', 
              opacity: 0.95,
              textShadow: '0 4px 15px rgba(0,0,0,0.9)',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic'
            }}>
              🎪 Het Grand Theater
            </div>
            <h2 style={{ 
              color: 'white', 
              marginBottom: '35px',
              textShadow: '0 6px 20px rgba(0,0,0,0.9)',
              fontSize: '44px',
              fontFamily: 'Playfair Display, serif'
            }}>
              Magische Shows Vol Elegantie
            </h2>
            <p style={{ 
              fontSize: '22px', 
              marginBottom: '50px', 
              maxWidth: '850px', 
              margin: '0 auto 50px',
              lineHeight: 1.8,
              textShadow: '0 3px 12px rgba(0,0,0,0.8)'
            }}>
              In dit luxueuze theater gebeurt alle magie! Interactieve voorstellingen in een authentieke 
              stoomboot setting waarin elk kind de hoofdrol speelt in het Sinterklaas verhaal.
            </p>
            
            {/* Elegante Show Features */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '35px', 
              marginTop: '60px' 
            }}>
              <div 
                className="card scroll-reveal" 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.97)', 
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                  border: '2px solid rgba(218, 165, 32, 0.3)'
                }}
              >
                <div style={{ fontSize: '55px', marginBottom: '20px' }}>❤️</div>
                <h3 style={{ 
                  color: 'var(--sinterklaas-rood)', 
                  marginBottom: '18px', 
                  fontSize: '26px',
                  fontFamily: 'Playfair Display, serif'
                }}>
                  Hartverwarming
                </h3>
                <p style={{ fontSize: '18px', lineHeight: 1.6 }}>
                  Elke show wordt uitgevoerd met liefde en passie. Elk kind voelt zich als een echte VIP 
                  passagier aan boord van onze luxueuze stoomboot!
                </p>
              </div>
              
              <div 
                className="card scroll-reveal" 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.97)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                  border: '2px solid rgba(218, 165, 32, 0.3)'
                }}
              >
                <div style={{ fontSize: '55px', marginBottom: '20px' }}>🛡️</div>
                <h3 style={{ 
                  color: 'var(--sinterklaas-rood)', 
                  marginBottom: '18px', 
                  fontSize: '26px',
                  fontFamily: 'Playfair Display, serif'
                }}>
                  Premium & Veilig
                </h3>
                <p style={{ fontSize: '18px', lineHeight: 1.6 }}>
                  Alle bemanningsleden zijn ervaren en gecertificeerd in kindvriendelijke entertainment. 
                  Onze stoomboot voldoet aan de hoogste veiligheidsnormen!
                </p>
              </div>
              
              <div 
                className="card scroll-reveal" 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.97)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                  border: '2px solid rgba(218, 165, 32, 0.3)'
                }}
              >
                <div style={{ fontSize: '55px', marginBottom: '20px' }}>🏆</div>
                <h3 style={{ 
                  color: 'var(--sinterklaas-rood)', 
                  marginBottom: '18px', 
                  fontSize: '26px',
                  fontFamily: 'Playfair Display, serif'
                }}>
                  Award-Winning
                </h3>
                <p style={{ fontSize: '18px', lineHeight: 1.6 }}>
                  Onze stoomboot crew heeft nationale erkenning gekregen voor de meest authentieke 
                  en innovatieve Sinterklaas beleving van België!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentieke Machinekamer - Safety Section */}
      <section id="safety" className="stoomboot-section stoomboot-machinekamer">
        <div className="machinekamer-installaties">
          <div 
            className="stoomketel-complex verhaal-element"
            onClick={() => setActivePopup('machine')}
            title="Klik op de stoomketel!"
          >
            <div className="ketel-bovenkant"></div>
            <div className="druk-meter">
              <div className="meter-wijzer"></div>
            </div>
            <div className="ketel-ventielen">
              <div className="ventiel"></div>
              <div className="ventiel"></div>
              <div className="ventiel"></div>
            </div>
          </div>
          
          <div 
            className="stoomketel-complex verhaal-element"
            onClick={() => setActivePopup('machine')}
            style={{ animationDelay: '0.5s' }}
          >
            <div className="ketel-bovenkant"></div>
            <div className="druk-meter">
              <div className="meter-wijzer" style={{ animationDelay: '0.7s' }}></div>
            </div>
            <div className="ketel-ventielen">
              <div className="ventiel"></div>
              <div className="ventiel"></div>
            </div>
          </div>
          
          <div 
            className="stoomketel-complex verhaal-element"
            onClick={() => setActivePopup('machine')}
            style={{ animationDelay: '1s' }}
          >
            <div className="ketel-bovenkant"></div>
            <div className="druk-meter">
              <div className="meter-wijzer" style={{ animationDelay: '1.3s' }}></div>
            </div>
            <div className="ketel-ventielen">
              <div className="ventiel"></div>
              <div className="ventiel"></div>
              <div className="ventiel"></div>
              <div className="ventiel"></div>
            </div>
          </div>
          
          <div 
            className="stoomketel-complex verhaal-element"
            onClick={() => setActivePopup('machine')}
            style={{ animationDelay: '1.5s' }}
          >
            <div className="ketel-bovenkant"></div>
            <div className="druk-meter">
              <div className="meter-wijzer" style={{ animationDelay: '2s' }}></div>
            </div>
            <div className="ketel-ventielen">
              <div className="ventiel"></div>
              <div className="ventiel"></div>
            </div>
          </div>
        </div>
        
        <div className="stoom-leidingen-complex">
          <div className="stoom-leiding">
            <div className="stoom-uitlaat"></div>
            <div className="temperatuur-indicator"></div>
          </div>
          <div className="stoom-leiding">
            <div className="stoom-uitlaat" style={{ animationDelay: '1s' }}></div>
            <div className="temperatuur-indicator"></div>
          </div>
          <div className="stoom-leiding">
            <div className="stoom-uitlaat" style={{ animationDelay: '2s' }}></div>
            <div className="temperatuur-indicator"></div>
          </div>
          <div className="stoom-leiding">
            <div className="stoom-uitlaat" style={{ animationDelay: '0.5s' }}></div>
            <div className="temperatuur-indicator"></div>
          </div>
        </div>
        
        <div className="kolen-oven">
          <div className="oven-deur"></div>
        </div>

        <div className="container">
          {/* Professionele Techniek-Piet */}
          <div 
            className="piet-character"
            style={{ 
              top: '35%', 
              left: '18%', 
              fontSize: '80px',
              filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.8))'
            }}
          >
            👨‍🔧
          </div>

          <div className="scroll-reveal" style={{ color: 'white', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '20px', 
              opacity: 0.9,
              textShadow: '0 4px 15px rgba(0,0,0,0.9)',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic'
            }}>
              ⚙️ In de Machinekamer
            </div>
            <h2 style={{ 
              color: 'white', 
              marginBottom: '35px',
              textShadow: '0 6px 20px rgba(0,0,0,0.9)',
              fontSize: '42px',
              fontFamily: 'Playfair Display, serif'
            }}>
              Hart van de Stoomboot
            </h2>
            <p style={{ 
              fontSize: '22px', 
              marginBottom: '45px', 
              lineHeight: 1.8,
              textShadow: '0 3px 12px rgba(0,0,0,0.8)'
            }}>
              In deze authentieke machinekamer werken de Techniek-Pieten met precisie aan de 
              geavanceerde stoomketels en systemen die onze luxueuze stoomboot aandrijven. 
              Elke machine heeft een speciale functie in het magische proces!
            </p>
            
            {/* Premium Safety Features */}
            <div style={{ 
              background: 'rgba(218, 165, 32, 0.12)', 
              padding: '35px', 
              borderRadius: '25px', 
              marginBottom: '40px',
              border: '3px solid rgba(218, 165, 32, 0.2)',
              backdropFilter: 'blur(15px)'
            }}>
              <h3 style={{ 
                color: 'var(--sinterklaas-goud-light)', 
                marginBottom: '25px', 
                fontSize: '28px',
                textShadow: '0 3px 12px rgba(0,0,0,0.8)',
                fontFamily: 'Playfair Display, serif'
              }}>
                🔧 Premium Veiligheid & Kwaliteit
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '25px', 
                textAlign: 'left' 
              }}>
                {[
                  '✅ Alle stoomketels dagelijks geïnspecteerd door gecertificeerde ingenieurs',
                  '✅ Ervaren Techniek-Pieten met 15+ jaar scheepvaart ervaring',
                  '✅ Geavanceerde druk- en temperatuurmonitoring systemen',
                  '✅ 24/7 monitoring van alle kritieke scheepssystemen',
                  '✅ Kinderen altijd begeleid door gekwalificeerde bemanningsleden',
                  '✅ Moderne veiligheidssystemen gecombineerd met traditionele vakmanschap'
                ].map((item, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px',
                      fontSize: '18px',
                      lineHeight: 1.6,
                      textShadow: '0 2px 8px rgba(0,0,0,0.7)'
                    }}
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kajuiten - FAQ Section */}
      <section id="faq" className="stoomboot-section stoomboot-kajuiten">
        <div className="kajuit-ramen">
          <div 
            className="raam verhaal-element"
            onClick={() => setActivePopup('raam')}
            title="Kijk door het raam!"
          />
          <div 
            className="raam verhaal-element"
            onClick={() => setActivePopup('raam')}
          />
          <div 
            className="raam verhaal-element"
            onClick={() => setActivePopup('raam')}
          />
          <div 
            className="raam verhaal-element"
            onClick={() => setActivePopup('raam')}
          />
        </div>

        <div className="container">
          {/* Pieten in de kajuiten */}
          <div className="piet-character" style={{ top: '20%', left: '10%' }}>👨‍🦱</div>
          <div className="piet-character" style={{ bottom: '20%', right: '10%' }}>👩‍🦱</div>

          <div className="scroll-reveal" style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
            <div style={{ fontSize: '20px', marginBottom: '15px', opacity: 0.8 }}>
              🏠 In de Kajuiten
            </div>
            <h2 style={{ color: 'white', marginBottom: '30px' }}>
              Veelgestelde Vragen van Passagiers
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
              In de kajuiten beantwoorden de Pieten alle vragen van nieuwsgierige passagiers!
            </p>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqItems.map((item, index) => (
              <div key={index} className={`card scroll-reveal ${openFaq === index ? 'active' : ''}`} style={{ marginBottom: '16px', background: 'rgba(255, 255, 255, 0.95)' }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  style={{ 
                    padding: '20px',
                    border: 'none',
                    background: 'none',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--text-dark)'
                  }}
                >
                  <span>{item.question}</span>
                  {openFaq === index ? <Minus size={20} color="var(--sinterklaas-rood)" /> : <Plus size={20} color="var(--sinterklaas-rood)" />}
                </button>
                {openFaq === index && (
                  <div style={{ padding: '0 20px 20px', color: '#666' }}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achterdek - News & Contact */}
      <section id="news" className="stoomboot-section stoomboot-achterdek">
        <div className="achterdek-reling"></div>
        <div 
          className="achterdek-vlag verhaal-element"
          onClick={() => setActivePopup('vlag')}
          title="Klik op de vlag van Genk!"
        />

        <div className="container">
          {/* Sinterklaas zwaait vaarwel */}
          <div 
            className="sinterklaas-character"
            style={{ top: '20%', left: '50%', transform: 'translateX(-50%)', fontSize: '90px' }}
          >
            🎅
          </div>
          
          {/* Pieten zwaaien mee */}
          <div className="piet-character" style={{ top: '30%', left: '25%' }}>👨‍🦱</div>
          <div className="piet-character" style={{ top: '30%', right: '25%' }}>👩‍🦱</div>

          <div className="scroll-reveal" style={{ textAlign: 'center', marginTop: '100px' }}>
            <div style={{ fontSize: '20px', marginBottom: '15px', opacity: 0.8 }}>
              🏁 Einde van de Reis
            </div>
            <h2 style={{ marginBottom: '30px' }}>
              Bedankt voor het Meevaren!
            </h2>
            <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
              Je hebt nu de hele magische stoomboot verkend! Ben je klaar voor een echte voorstelling 
              met Sinterklaas en zijn Pieten in Genk?
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
              <div className="card scroll-reveal">
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>📞</div>
                <h3 style={{ marginBottom: '15px' }}>Reserveer Tickets</h3>
                <p style={{ marginBottom: '20px' }}>Bel ons voor de beste plekken aan boord!</p>
                <p style={{ fontWeight: 'bold', color: 'var(--sinterklaas-rood)' }}>+32 (0)89 123 456</p>
              </div>
              
              <div className="card scroll-reveal">
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>📧</div>
                <h3 style={{ marginBottom: '15px' }}>Email Ons</h3>
                <p style={{ marginBottom: '20px' }}>Vragen over onze magische reizen?</p>
                <p style={{ fontWeight: 'bold', color: 'var(--sinterklaas-rood)' }}>info@sinterklaasgenk.be</p>
              </div>
              
              <div className="card scroll-reveal">
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>📍</div>
                <h3 style={{ marginBottom: '15px' }}>Aanlegplaats</h3>
                <p style={{ marginBottom: '20px' }}>Waar de stoomboot aanmeert:</p>
                <p style={{ fontWeight: 'bold', color: 'var(--sinterklaas-rood)' }}>Cultureel Centrum Genk<br/>Dieplaan 17, 3600 Genk</p>
              </div>
            </div>
            
            <div style={{ marginTop: '50px' }}>
              <button className="btn btn-primary" style={{ fontSize: '20px', padding: '20px 40px' }}>
                <Gift size={24} />
                Kom Aan Boord - Reserveer Nu!
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}