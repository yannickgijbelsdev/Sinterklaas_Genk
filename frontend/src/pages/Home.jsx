import React, { useState, useEffect } from 'react';
import { 
  Gift, Star, Calendar, Clock, Users, Heart, Shield, Award, 
  CheckCircle, ArrowRight, Play, Download, Plus, Minus,
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube,
  X, Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import '../styles/stoomboot-theme.css';

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

      {/* Boeg/Dek - Hero Section */}
      <section id="hero" className="stoomboot-section stoomboot-boeg">
        <div className="container">
          {/* Sinterklaas Character */}
          <div 
            className="sinterklaas-character verhaal-element"
            style={{ top: '20%', left: '10%' }}
            onClick={() => setActivePopup('anker')}
            title="Klik voor het verhaal van het anker!"
          >
            🎅
          </div>
          
          {/* Piet Characters */}
          <div 
            className="piet-character verhaal-element"
            style={{ top: '30%', right: '20%' }}
            onClick={() => setActivePopup('anker')}
          >
            👨‍🦱
          </div>
          <div 
            className="piet-character verhaal-element"
            style={{ bottom: '20%', left: '15%' }}
            onClick={() => setActivePopup('anker')}
          >
            👩‍🦱
          </div>

          <div className="scroll-reveal" style={{ textAlign: 'center', color: 'white', zIndex: 5, position: 'relative' }}>
            <div style={{ fontSize: '24px', marginBottom: '20px', opacity: 0.9 }}>
              🚢 Welkom aan boord! 🚢
            </div>
            <h1 style={{ color: 'white', marginBottom: '30px' }}>
              De Magische Sinterklaas Stoomboot
            </h1>
            <p style={{ fontSize: '22px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
              Stap aan boord van Sinterklaas' magische stoomboot en ontdek elke hoek vol verrassingen! 
              Scroll omlaag om door de stoomboot te reizen...
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary">
                <Gift size={20} />
                Kom Aan Boord!
              </button>
              <button className="btn btn-secondary">
                <Calendar size={20} />
                Bekijk Show Data
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stuurhut - About Section */}
      <section id="about" className="stoomboot-section stoomboot-stuurhut">
        <div className="container">
          {/* Stuurwiel Interactief Element */}
          <div 
            className="stuurwiel verhaal-element"
            onClick={() => setActivePopup('stuurwiel')}
            title="Klik op het stuurwiel voor het verhaal!"
          />
          
          {/* Sinterklaas bij het stuur */}
          <div 
            className="sinterklaas-character"
            style={{ top: '40%', right: '20%', fontSize: '70px' }}
          >
            🎅
          </div>

          <div className="scroll-reveal" style={{ color: 'white', maxWidth: '700px' }}>
            <div style={{ fontSize: '20px', marginBottom: '15px', opacity: 0.8 }}>
              🧭 In de Stuurhut
            </div>
            <h2 style={{ color: 'white', marginBottom: '30px' }}>
              Sinterklaas navigeert naar Genk
            </h2>
            <p style={{ fontSize: '20px', marginBottom: '30px', lineHeight: 1.7 }}>
              Vanuit deze stuurhut bestuurt Sinterklaas zijn magische stoomboot door de wolken. 
              Al meer dan 15 jaar vaart hij naar Genk om de meest interactieve en magische shows te brengen!
            </p>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--sinterklaas-goud)', marginBottom: '15px' }}>⭐ Kapitein Sinterklaas vertelt:</h3>
              <p style={{ fontStyle: 'italic' }}>
                "Elk kind dat onze show bezoekt, wordt onderdeel van de bemanning! 
                Samen maken we van elke voorstelling een onvergetelijk avontuur."
              </p>
            </div>
            <button className="btn btn-secondary">
              Leer meer over de bemanning
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Theater/Grote Zaal - Shows Section */}
      <section id="shows" className="stoomboot-section stoomboot-theater">
        <div className="theater-gordijnen">
          <div 
            className="verhaal-element"
            style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '30px' }}
            onClick={() => setActivePopup('gordijn')}
            title="Klik op de gordijnen!"
          >
            🎭
          </div>
        </div>
        <div className="theater-spotlights">
          <div className="spotlight"></div>
          <div className="spotlight"></div>
          <div className="spotlight"></div>
        </div>
        
        <div className="container" style={{ marginTop: '80px' }}>
          {/* Sinterklaas op het podium */}
          <div 
            className="sinterklaas-character"
            style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', fontSize: '90px' }}
          >
            🎅
          </div>
          
          {/* Pieten aan de zijkanten */}
          <div className="piet-character" style={{ top: '25%', left: '20%' }}>👨‍🦱</div>
          <div className="piet-character" style={{ top: '25%', right: '20%' }}>👩‍🦱</div>

          <div className="scroll-reveal" style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>
            <div style={{ fontSize: '20px', marginBottom: '15px', opacity: 0.9 }}>
              🎪 Het Grote Theater
            </div>
            <h2 style={{ color: 'white', marginBottom: '30px' }}>
              Magische Shows Vol Verrassingen
            </h2>
            <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
              In dit magische theater gebeurt alle magie! Interactieve voorstellingen waarin elk kind 
              de hoofdrol speelt in het Sinterklaas verhaal.
            </p>
            
            {/* Show Features */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '50px' }}>
              <div className="card scroll-reveal" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>❤️</div>
                <h3 style={{ color: 'var(--sinterklaas-rood)', marginBottom: '15px' }}>Hartverwarming</h3>
                <p>Elke show wordt uitgevoerd met liefde. Elk kind voelt zich speciaal aan boord!</p>
              </div>
              
              <div className="card scroll-reveal" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>🛡️</div>
                <h3 style={{ color: 'var(--sinterklaas-rood)', marginBottom: '15px' }}>Veilig & Vertrouwd</h3>
                <p>Alle bemanningsleden zijn ervaren en getraind in kindvriendelijke magie!</p>
              </div>
              
              <div className="card scroll-reveal" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>🏆</div>
                <h3 style={{ color: 'var(--sinterklaas-rood)', marginBottom: '15px' }}>Award-winning</h3>
                <p>Onze stoomboot crew heeft meerdere prijzen gewonnen voor beste kindertheater!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Machinekamer - Safety Section */}
      <section id="safety" className="stoomboot-section stoomboot-machinekamer">
        <div className="machine-onderdelen">
          <div 
            className="machine verhaal-element"
            onClick={() => setActivePopup('machine')}
            title="Klik op de cadeau-machine!"
          />
          <div 
            className="machine verhaal-element"
            onClick={() => setActivePopup('machine')}
          />
          <div 
            className="machine verhaal-element"
            onClick={() => setActivePopup('machine')}
          />
        </div>
        
        <div className="stoom-pijpen">
          <div className="pijp"></div>
          <div className="pijp" style={{ height: '180px' }}></div>
          <div className="pijp" style={{ height: '220px' }}></div>
        </div>

        <div className="container">
          {/* Piet Engineer */}
          <div 
            className="piet-character"
            style={{ top: '30%', left: '15%', fontSize: '70px' }}
          >
            👨‍🔧
          </div>

          <div className="scroll-reveal" style={{ color: 'white', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '15px', opacity: 0.8 }}>
              ⚙️ In de Machinekamer
            </div>
            <h2 style={{ color: 'white', marginBottom: '30px' }}>
              Hier Gebeurt de Magie!
            </h2>
            <p style={{ fontSize: '20px', marginBottom: '40px', lineHeight: 1.7 }}>
              In de machinekamer werken de Techniek-Pieten hard om alle cadeautjes te maken 
              en de stoomboot soepel te laten varen. Elke machine heeft een speciale functie!
            </p>
            
            {/* Safety Features */}
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '30px', borderRadius: '20px', marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--sinterklaas-goud)', marginBottom: '20px' }}>🔧 Veiligheid Voorop</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
                {[
                  '✅ Alle machines regelmatig gecontroleerd',
                  '✅ Ervaren Techniek-Pieten aan het werk',
                  '✅ Magische veiligheidssystemen actief',
                  '✅ 24/7 monitoring van alle processen',
                  '✅ Kinderen altijd begeleid door experts',
                  '✅ Moderne uitrusting met Sinterklaas magie'
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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