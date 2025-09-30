import React, { useState } from 'react';
import { 
  Gift, Star, Calendar, Clock, Users, Heart, Shield, Award, 
  CheckCircle, ArrowRight, Play, Download, Plus, Minus,
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube
} from 'lucide-react';
import { Button } from '../components/ui/button';
import '../styles/camp-buddy-theme.css';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

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
      
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="eyebrow">Ho ho ho, welkom!</div>
            <h1>De Magische Sinterklaas Show in Genk</h1>
            <p className="hero-subtitle">
              Beleef samen met je kinderen de meest interactieve en magische Sinterklaasshow van België. 
              Vol verrassingen, liedjes en natuurlijk echte magie!
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary">
                <Gift size={20} />
                Reserveer Tickets
              </button>
              <button className="btn btn-secondary">
                <Calendar size={20} />
                Bekijk Data
              </button>
            </div>
          </div>
          
          <div className="hero-illustration">
            <div style={{
              fontSize: '120px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <span>🎅</span>
              <span>🎁</span>
              <span>👧</span>
              <span>👦</span>
              <span>⭐</span>
            </div>
          </div>
        </div>
      </section>

      {/* Over Ons Section */}
      <section id="about" className="section section-dark section-padding">
        <div className="container">
          <div className="two-column">
            <div>
              <div className="eyebrow text-white">Over Sinterklaas Genk</div>
              <h2 className="text-white mb-8">Wat maakt onze show zo speciaal?</h2>
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
                <div style={{ fontSize: '80px', textAlign: 'center' }}>
                  🎅👧👦
                  <div style={{ fontSize: '16px', marginTop: '16px', color: '#666' }}>
                    Sinterklaas met blije kinderen
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

      {/* Shows Section */}
      <section id="shows" className="section section-light section-padding">
        <div className="sinterklaas-decoration" style={{top: '10%', left: '5%'}}>🎁</div>
        <div className="sinterklaas-decoration" style={{top: '20%', right: '10%'}}>⭐</div>
        <div className="sinterklaas-decoration" style={{bottom: '15%', left: '8%'}}>🎅</div>
        
        <div className="container">
          <div className="text-center mb-16">
            <h2>Magische, Veilige en Ervaren Shows</h2>
            <p style={{ fontSize: '20px', color: '#666' }}>
              Al onze shows voldoen aan de hoogste standaarden voor kwaliteit en plezier.
            </p>
          </div>
          
          <div className="three-column">
            <div className="card feature-card">
              <div className="feature-icon">
                <Heart size={32} color="#DC2626" />
              </div>
              <h3 className="feature-title">Hartverwarming</h3>
              <p>Elke show wordt uitgevoerd met liefde en passie. We zorgen ervoor dat elk kind zich speciaal en geliefd voelt tijdens onze magische voorstelling.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">
                <Shield size={32} color="#DC2626" />
              </div>
              <h3 className="feature-title">Veilig & Vertrouwd</h3>
              <p>Al onze acteurs hebben achtergrondcontroles ondergaan en zijn getraind in kindvriendelijke interactie. Veiligheid staat altijd voorop.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">
                <Award size={32} color="#DC2626" />
              </div>
              <h3 className="feature-title">Award-winning Team</h3>
              <p>Ons team heeft meerdere prijzen gewonnen voor de beste kindervoorstellingen in de regio. Ervaring en kwaliteit gegarandeerd.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waarom Section */}
      <section id="safety" className="section section-cream section-padding">
        <div className="container">
          <div className="two-column">
            <div>
              <div className="eyebrow">Voor Families</div>
              <h2 className="mb-8">Waarom kiezen gezinnen voor onze Sinterklaasshows?</h2>
              <p className="mb-8" style={{ color: '#666' }}>
                We begrijpen dat het kiezen van de juiste Sinterklaasshow belangrijk is voor uw gezin. 
                Daarom zorgen wij voor een onvergetelijke ervaring.
              </p>
              
              <div style={{ marginBottom: '32px' }}>
                {[
                  'Volledig achtergrond-gescreende acteurs',
                  'Interactieve shows aangepast per leeftijdsgroep',
                  'Flexibele data en tijdstippen',
                  'Transparante prijzen zonder verborgen kosten',
                  'Live updates en communicatie met ouders',
                  'Professionele fotograaf aanwezig'
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <CheckCircle size={20} color="#DC2626" style={{ marginRight: '12px', minWidth: '20px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '280px',
                height: '400px',
                background: 'var(--warm-white)',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: 'var(--shadow-medium)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>📱</div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ marginBottom: '10px' }}>Sinterklaas App</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Download onze app voor updates, foto's en herinneringen aan jullie magische avond!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            {blogPosts.map((post, index) => (
              <div key={index} className="card" style={{ overflow: 'hidden', padding: '0' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, var(--sinterklaas-goud-light) 0%, var(--sinterklaas-goud) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px'
                }}>
                  {post.icon}
                </div>
                <div style={{ padding: '24px' }}>
                  <div className="sinterklaas-badge" style={{ marginBottom: '16px' }}>
                    {post.category}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', lineHeight: '1.3' }}>
                    {post.title}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '16px' }}>{post.excerpt}</p>
                  <a href="#" style={{ color: 'var(--sinterklaas-rood)', textDecoration: 'none', fontWeight: '600' }}>
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
                    <span>{post.readTime}</span>
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
              <p style={{ color: '#666' }}>+32 (0)89 123 456</p>
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
              <p style={{ color: '#666' }}>info@sinterklaasgenk.be</p>
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
              <p style={{ color: '#666' }}>Cultureel Centrum Genk<br/>Dieplaan 17, 3600 Genk</p>
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