import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gift, Star, Calendar, Clock, Users, Heart, Shield, Award, 
  CheckCircle, ArrowRight, Play, Download, Plus, Minus, X,
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Eye
} from 'lucide-react';
import { Button } from '../components/ui/button';
import AdvancedLiveEditor from '../components/AdvancedLiveEditor';
import { useAuth } from '../contexts/AuthContext';
import { useLiveEditor } from '../contexts/LiveEditorContext';
import '../styles/camp-buddy-theme.css';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(-1);
  const [content, setContent] = useState({});
  const [news, setNews] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [newsDisplayCount, setNewsDisplayCount] = useState(3);
  const [loadingMoreNews, setLoadingMoreNews] = useState(false);
  const [currentPartnerSet, setCurrentPartnerSet] = useState(0);
  
  // Gallery lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Partner logo sets that will rotate - Expanded with all 7 logos
  const partnerSets = [
    [
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/ajsbqyr6_Jumbo_Genk.png",
        alt: "Jumbo Genk Logo",
        id: "partner_jumbo_genk_logo"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/ggy8l0ja_Poolse_Dansgroep.png", 
        alt: "Poolse Dansgroep Logo",
        id: "partner_poolse_dansgroep_logo"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/6rvbd219_Balls_Glory.png",
        alt: "Balls Glory Logo", 
        id: "partner_balls_glory_logo"
      }
    ],
    [
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/0kogizc7_Rotary_Genk.png",
        alt: "Rotary Genk Logo",
        id: "partner_rotary_genk_logo"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/bv2w2k83_GENK-LOGO-SCREEN-POSITIEF-RGB.png",
        alt: "Genk Logo",
        id: "partner_genk_logo"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/v32730xq_Hotel_Bonka.svg",
        alt: "Hotel Bonka Logo",
        id: "partner_hotel_bonka_logo"
      }
    ],
    [
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/xa0191iz_tk3ymnog_SW-2025-LOGO-RGB.png",
        alt: "SW 2025 Logo",
        id: "partner_sw_2025_logo"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/ajsbqyr6_Jumbo_Genk.png",
        alt: "Jumbo Genk Logo",
        id: "partner_jumbo_genk_logo_2"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/0kogizc7_Rotary_Genk.png",
        alt: "Rotary Genk Logo",
        id: "partner_rotary_genk_logo_2"
      }
    ],
    [
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/v32730xq_Hotel_Bonka.svg",
        alt: "Hotel Bonka Logo",
        id: "partner_hotel_bonka_logo_2"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/6rvbd219_Balls_Glory.png",
        alt: "Balls Glory Logo",
        id: "partner_balls_glory_logo_2"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/bv2w2k83_GENK-LOGO-SCREEN-POSITIEF-RGB.png",
        alt: "Genk Logo",
        id: "partner_genk_logo_2"
      }
    ],
    [
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/ggy8l0ja_Poolse_Dansgroep.png",
        alt: "Poolse Dansgroep Logo",
        id: "partner_poolse_dansgroep_logo_2"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/xa0191iz_tk3ymnog_SW-2025-LOGO-RGB.png",
        alt: "SW 2025 Logo", 
        id: "partner_sw_2025_logo_2"
      },
      {
        src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/v32730xq_Hotel_Bonka.svg",
        alt: "Hotel Bonka Logo",
        id: "partner_hotel_bonka_logo_3"
      }
    ]
  ];

  // Gallery images
  const galleryImages = [
    {
      src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/07f51h8b_Wenssexpress__1.50.1.jpg",
      alt: "Sinterklaas en de Wensmachine - Scene 1",
      title: "Wenssexpress Scene 1"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/saea5881_Wenssexpress__1.95.1.jpg",
      alt: "Sinterklaas en de Wensmachine - Scene 2", 
      title: "Wenssexpress Scene 2"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/izi2wnpm_Wenssexpress__1.23.1.jpg",
      alt: "Sinterklaas en de Wensmachine - Scene 3",
      title: "Wenssexpress Scene 3"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/e9m4txzp_Wenssexpress__1.33.1.jpg",
      alt: "Sinterklaas en de Wensmachine - Scene 4",
      title: "Wenssexpress Scene 4"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_genk-santa-admin/artifacts/xqnej0us_Wenssexpress__1.120.1.jpg",
      alt: "Sinterklaas en de Wensmachine - Scene 5",
      title: "Wenssexpress Scene 5"
    }
  ];

  // Load and apply stored content on page load - for ALL users
  useEffect(() => {
    const loadStoredContent = async () => {
      try {
        // Load stored content from backend (public endpoint)
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/content`);
        if (response.ok) {
          const contentData = await response.json();
          
          console.log('Loading content data:', contentData); // Debug log
          
          // Apply content to elements
          contentData.forEach(item => {
            const element = document.querySelector(`[data-edit-id="${item.id}"]`);
            if (element) {
              if (element.tagName === 'IMG') {
                element.src = item.value;
              } else if (element.tagName === 'VIDEO') {
                element.src = item.value;
                const source = element.querySelector('source');
                if (source) source.src = item.value;
              } else {
                element.textContent = item.value;
              }
            }
          });
        }
      } catch (error) {
        console.log('Could not load stored content, using defaults');
      }
    };

    // Handle real-time updates from live editor
    const handleContentUpdate = (event) => {
      if (event.key === 'contentUpdate') {
        try {
          const update = JSON.parse(event.newValue);
          if (update && update.id && update.value) {
            const element = document.querySelector(`[data-edit-id="${update.id}"]`);
            if (element) {
              if (element.tagName === 'IMG') {
                element.src = update.value;
              } else if (element.tagName === 'VIDEO') {
                element.src = update.value;
                const source = element.querySelector('source');
                if (source) source.src = update.value;
              } else {
                element.textContent = update.value;
              }
            }
          }
        } catch (error) {
          console.log('Error handling content update:', error);
        }
      }
    };

    // Load content immediately when component mounts
    loadStoredContent();
    
    // Listen for real-time updates
    window.addEventListener('storage', handleContentUpdate);
    
    // Also reload content periodically as backup (every 30 seconds)
    const interval = setInterval(loadStoredContent, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleContentUpdate);
    };
  }, []);

  // Rotate partner logos every 4 seconds
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setCurrentPartnerSet((prev) => (prev + 1) % partnerSets.length);
    }, 4000);

    return () => clearInterval(rotationInterval);
  }, [partnerSets.length]);

  // Gallery lightbox functions
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen]);

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
          fetch(`${API}/content`),
          fetch(`${API}/news`),
          fetch(`${API}/shows`)
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
      question: "Hoe lang duurt de voorstelling?",
      answer: "De voorstelling duurt ongeveer een uur. Het is een afwisseling tussen live theater, filmbeelden, liedjes en animatie. Na de voorstelling kan je nog een drankje drinken in de Foyer en delen de Pieten snoepzakjes uit aan de kinderen."
    },
    {
      question: "Is de voorstelling bereikbaar voor mensen met een rolstoel?",
      answer: "Ja, het stadhuis is toegankelijk voor iedereen. Bent u slecht te been of gebruikt u een rolstoel: kom dan langs het hellend vlak aan de hoofdingang. Op het Balieplein vind je een lift voor personen met een handicap die toegang geeft tot de schouwburg. Druk op 1 B. Kom op tijd en verwittig het personeel aan de zaal dan helpen we u ook in de zaal om een plekje te verzekeren."
    },
    {
      question: "Zijn de plaatsen genummerd?",
      answer: "Neen, we werken niet met genummerde plaatsen. Een half uur voor iedere voorstelling gaan de deuren van de Foyer open en kan je al een drankje drinken. Tien minuten voor iedere voorstelling gaan de deuren van de zaal open."
    },
    {
      question: "Kan ik mijn tickets omruilen voor een ander uur of andere datum of kunnen mijn tickets worden terugbetaald?",
      answer: "Dat is helaas niet mogelijk. We werken met een externe ticketverdeler flextickets.nl. Denk dus goed na voor u een ticket koopt. Bij eventuele ziekte of verlet kan u de kaarten wel doorgeven aan iemand anders."
    },
    {
      question: "Komt Loes Van den Heuvel naar de voorstelling?",
      answer: "Neen, de voorstelling is een afwisseling tussen live theater en filmbeelden. Loes Van den Heuvel speelt de rol van Koningin Marie Antoinette. Ze zijn dus niet live aanwezig in de zaal. Sinterklaas en de pieten komen wel live naar de voorstelling samen met een hele hoop andere acteurs."
    },
    {
      question: "Delen de Sint en de pieten na de voorstelling nog cadeautjes en snoep uit?",
      answer: "De Sint gaat na de voorstelling even rusten. De pieten delen snoep uit aan de kinderen na de voorstelling. Ieder kind met een ticket heeft recht op 1 snoepzakje. Deze snoepzakjes worden u aangeboden door het centrummanagement van Stad Genk."
    },
    {
      question: "Vanaf welke leeftijd moet een kind betalen?",
      answer: "Kinderen onder de 2 jaar hoeven geen ticket te betalen en kunnen mee op de schoot. Ze hebben geen recht op een stoel. Indien dit toch wenselijk is, koopt u best toch een ticket. Kinderen ouder dan 2 jaar moeten dus een ticket kopen."
    },
    {
      question: "Vanaf welke leeftijd is de voorstelling aan te raden?",
      answer: "De voorstelling is een mix tussen film, live theater, animatie en muziek. Op die manier is het ook voor kleine kinderen een feest. We adviseren de leeftijd vanaf 3 jaar."
    },
    {
      question: "Komen er roetpieten of Zwarte Pieten naar de voorstelling?",
      answer: "Er worden ons al jaren vragen gesteld over de figuur van Zwarte Piet. Dat kunnen we niet zomaar negeren. We hebben het uiterlijk van Piet licht aangepast vanwege de veranderende samenleving, maar met respect voor de Sinterklaastraditie. De pieten hebben geen dikke rode lippen meer en geen oorbellen. Verder krijgen ze roetvegen in plaats van een volledig zwart gezicht. We merken dat de kinderen het ook op die manier gewoon zijn de dag van vandaag."
    },
    {
      question: "Hoe komt het dat jullie tickets kunnen aanbieden aan 11 euro (kinderen) en 13 euro (volwassenen) per persoon?",
      answer: "We weten dat andere Sinterklaasvoorstellingen vaak het dubbele of meer kosten. VZW Studio Wonderland werkt hoofdzakelijk met vrijwilligers en met partners zoals Stad Genk. De voorstelling is ook beperkt tot een uur. Op die manier kunnen we de ticketprijs laag houden."
    },
    {
      question: "Vanaf wanneer moet ik een ticket kopen voor een volwassene?",
      answer: "Vanaf 18 jaar betaal je een ticket voor een volwassene. Kinderen tot 12 jaar hebben recht op een snoepzakje na de voorstelling."
    },
    {
      question: "Wat moet ik doen als ik mijn ticket kwijt ben of ik mijn tickets niet heb ontvangen?",
      answer: "Probeer zelf de tickets nogmaals te sturen. Lukt het dan nog niet? Stuur dan een e-mail naar support@flextickets.nl"
    },
    {
      question: "Waarom betaal ik boekingskosten voor mijn tickets?",
      answer: "We werken met een externe ticketverdeler flextickets. In de boekingskost zitten zowel de prijs van de handeling van de tickets als de kosten die de bank aanrekent voor het afrekenen van de tickets. Terwijl je bij de meeste ticketverdelers een bedrag betaalt per ticket werken we hier met één prijs per boeking. Je betaalt dus 2 euro boekingskost voor het bestellen van 1 ticket, maar evenveel als je bijvoorbeeld 10 tickets boekt. Het is dus aan te raden om in grote groep tickets te bestellen."
    },
    {
      question: "Is er parkeerplaats voorzien?",
      answer: "Parkeren kan op verschillende plaatsen rondom het Stadhuis van Genk."
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
        
        {/* Partner Logos Banner - Bottom Left - Rotating Carousel */}
        <div 
          className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg"
          style={{ zIndex: 10 }}
          data-edit-id="partners_section"
        >
          <div className="flex items-center gap-6">
            <span 
              className="text-base text-gray-700 font-medium whitespace-nowrap"
              data-edit-id="partners_label"
            >
              Partners:
            </span>
            <div className="flex items-center gap-4 transition-all duration-500 ease-in-out">
              {partnerSets[currentPartnerSet].map((partner, index) => (
                <img 
                  key={`${currentPartnerSet}-${index}`}
                  src={partner.src}
                  alt={partner.alt}
                  className="h-16 w-auto object-contain opacity-85 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
                  data-edit-id={partner.id}
                  style={{
                    animation: `fadeInScale 0.5s ease-in-out ${index * 0.1}s both`,
                    maxWidth: '120px'
                  }}
                />
              ))}
            </div>
            
            {/* Rotation indicator dots */}
            <div className="flex gap-1 ml-2">
              {partnerSets.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPartnerSet 
                      ? 'bg-red-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCurrentPartnerSet(index)}
                />
              ))}
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
                Reserveer nu je tickets voor 'Sinterklaas en de Wensmachine'
              </h2>
              <p 
                className="text-white mb-8" 
                style={{ opacity: 0.9 }}
                data-edit-id="reserveer_description"
              >
                Sinterklaas en de Wensmachine komt dit jaar naar de Stadsschouwburg Genk met een betoverende mix van muziek, film en dans.<br />
                <br />
                Sinterklaas' Wensmachine loopt in de soep wanneer de buren het geheime speculaasrecept erin laten vallen. Gelukkig gaat detective Speurneus Romeo op zoek om het feest voor de kinderen te redden.<br />
                <br />
                Ook dit jaar duikt een bekend gezicht op in de filmpjes: Loes Van den Heuvel schittert als Marie Antoinette in een Middeleeuws avontuur.<br />
                <br />
                Breng bij de voorstelling kinderspeelgoed mee: Rotary Genk Noord zamelt in voor Sint-Vincentius, ten voordele van kinderen die het moeilijk hebben.
              </p>
              <button 
                className="btn btn-secondary"
                onClick={() => window.open('https://events.flextickets.nl/event/sinterklaas-en-de-wensmachine', '_blank')}
              >
                <Calendar size={20} />
                Bestel hier je tickets
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
                data-edit-id="reserveer_sinterklaas_image"
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
              Sintverhalen & Nieuws
            </h2>
            <p 
              style={{ fontSize: '20px', color: '#666' }}
              data-edit-id="news_subtitle"
            >
              Blijf op de hoogte van alle nieuwtjes en verhalen van Sinterklaas in Genk.
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

      {/* Photo Gallery Section */}
      <section 
        id="gallery"
        style={{ 
          background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
          padding: '80px 0',
          color: 'white'
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 
              style={{ 
                fontSize: '48px', 
                fontWeight: '800', 
                marginBottom: '20px',
                textShadow: '2px 4px 8px rgba(0,0,0,0.3)'
              }}
              data-edit-id="gallery_title"
            >
              Foto Galerij
            </h2>
            <p 
              style={{ 
                fontSize: '20px', 
                opacity: '0.9', 
                maxWidth: '600px', 
                margin: '0 auto',
                lineHeight: '1.6'
              }}
              data-edit-id="gallery_subtitle"
            >
              Beleef de magie van Sinterklaas en de Wensmachine met onze prachtige beelden
            </p>
          </div>

          {/* Gallery Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}
          >
            {galleryImages.map((image, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#fff'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                }}
              >
                <div
                  style={{
                    paddingBottom: '75%', // 4:3 aspect ratio
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'all 0.3s ease'
                    }}
                    onContextMenu={(e) => e.preventDefault()} // Prevent right-click
                    draggable={false} // Prevent dragging
                  />
                  
                  {/* Overlay on hover */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: '0',
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none' // Allow clicks to pass through to parent
                    }}
                    className="gallery-overlay"
                  >
                    <div style={{ textAlign: 'center', color: 'white' }}>
                      <Eye size={48} style={{ marginBottom: '12px' }} />
                      <p style={{ fontSize: '16px', fontWeight: '600' }}>Bekijk groter</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                <Gift size={28} color="#DC2626" />
                <span 
                  style={{ fontSize: '24px', fontWeight: '700', color: '#DC2626' }}
                  data-edit-id="footer_title"
                >
                  Sinterklaas Genk
                </span>
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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              zIndex: '10001'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              zIndex: '10001'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ‹
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              zIndex: '10001'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ›
          </button>

          {/* Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={galleryImages[currentImageIndex]?.src}
              alt={galleryImages[currentImageIndex]?.alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
              onContextMenu={(e) => e.preventDefault()} // Prevent right-click
              draggable={false} // Prevent dragging
            />
          </div>

          {/* Image Counter */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      {/* Advanced Live Editor Component */}
      <AdvancedLiveEditor />

    </div>
  );
}