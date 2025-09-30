import React, { useState, useEffect } from 'react';
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

      {/* Golvende Separator */}
      <div className="wavy-separator"></div>

      {/* About Section */}
      <section id="about" className="section section-dark section-padding">
        <div className="container">
          <div className="two-column">
            <div>
              <div className="eyebrow text-white">About us</div>
              <h2 className="text-white mb-8">What's Camp Buddy?</h2>
              <p className="text-white mb-8" style={{ opacity: 0.9 }}>
                Camp Buddy is the trusted platform that connects families with verified summer camps. 
                We make finding the perfect camp experience simple, safe, and stress-free for both 
                parents and children.
              </p>
              <button className="btn btn-secondary-white">
                Learn more
                <ArrowRight size={20} />
              </button>
            </div>
            
            <div>
              <div className="card card-white" style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '80px', textAlign: 'center' }}>
                  👩‍🏫👧👦
                  <div style={{ fontSize: '16px', marginTop: '16px', color: '#666' }}>
                    Kids + Counselor Illustration
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Camp Granite Lake Card */}
          <div className="mt-16">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '16px' }}>Camp Granite Lake</h3>
                <p style={{ marginBottom: '24px', color: '#666' }}>
                  Experience nature's beauty with hiking, fishing, and campfire stories. 
                  Perfect for adventurous kids ages 8-14.
                </p>
                <button className="btn btn-primary">
                  Request discovery detail
                </button>
              </div>
              <div style={{ 
                width: '200px', 
                height: '150px', 
                background: 'linear-gradient(135deg, #E8F5E8 0%, #D4F1D4 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                🌲⛺
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section section-light section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Safe, reliable, and experienced</h2>
            <p style={{ fontSize: '20px', color: '#666' }}>
              Every camp partner meets our rigorous standards for safety and quality.
            </p>
          </div>
          
          <div className="three-column">
            <div className="card feature-card">
              <div className="feature-icon">
                <Shield size={32} color="#2E3A2F" />
              </div>
              <h3 className="feature-title">Trusted safety standards</h3>
              <p>All camps undergo comprehensive safety audits and maintain current certifications for staff and facilities.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">
                <Award size={32} color="#2E3A2F" />
              </div>
              <h3 className="feature-title">Screened & verified</h3>
              <p>Every counselor passes background checks, reference verification, and specialized training requirements.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">
                <Clipboard size={32} color="#2E3A2F" />
              </div>
              <h3 className="feature-title">Secure & personalized</h3>
              <p>Your family's information is protected while we match you with camps that fit your child's unique needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Suited Section */}
      <section id="safety" className="section section-cream section-padding">
        <div className="container">
          <div className="two-column">
            <div>
              <div className="eyebrow">For parents</div>
              <h2 className="mb-8">Why is Camp Buddy suited for your child?</h2>
              <p className="mb-8" style={{ color: '#666' }}>
                We understand that choosing the right camp is one of the most important decisions you'll make for your child's summer.
              </p>
              
              <div style={{ marginBottom: '32px' }}>
                {[
                  'Comprehensive background checks for all staff',
                  'Expert counselors with specialized training',
                  'Flexible scheduling and booking options', 
                  'Transparent pricing with no hidden fees',
                  'Real-time updates and communication',
                  '24/7 parent support and emergency contact'
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <CheckCircle size={20} color="#1F4A33" style={{ marginRight: '12px', minWidth: '20px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div className="phone-mockup">
                <div className="phone-screen">
                  💬📱
                </div>
              </div>
              <div style={{
                position: 'absolute',
                top: '50%',
                right: '-50px',
                transform: 'translateY(-50%)',
                fontSize: '60px',
                opacity: 0.1,
                zIndex: -1
              }}>
                🏠🌿
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Demo Section */}
      <section id="demo" className="section section-dark section-padding">
        <div className="container">
          <div className="card" style={{ background: 'var(--dark-olive)', color: 'white', display: 'flex', alignItems: 'center', gap: '64px' }}>
            <div style={{ flex: 1 }}>
              <h2 className="text-white mb-8">Be our trusted camp partners by scheduling a demo!</h2>
              <p className="text-white mb-8" style={{ opacity: 0.9 }}>
                Join our network of verified camps and connect with families looking for quality experiences.
              </p>
              <button className="btn btn-primary">
                <Calendar size={20} />
                Schedule a demo
              </button>
            </div>
            <div style={{
              width: '300px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px'
            }}>
              📅🌸
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section section-peach section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Answering all your worries</h2>
            <p style={{ fontSize: '20px', color: '#666' }}>
              Common questions from parents about camp safety and booking.
            </p>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqItems.map((item, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'active' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span>{item.question}</span>
                  {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="section section-light section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2>Exciting reads you'll love</h2>
            <p style={{ fontSize: '20px', color: '#666' }}>
              Expert advice and insights for making the most of your child's camp experience.
            </p>
          </div>
          
          <div className="three-column">
            {blogPosts.map((post, index) => (
              <div key={index} className="blog-card">
                <div className="blog-image">
                  {post.icon}
                </div>
                <div className="blog-content">
                  <div className="blog-category">{post.category}</div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <a href="#" style={{ color: 'var(--primary-orange)', textDecoration: 'none', fontWeight: '600' }}>
                    Read more →
                  </a>
                  <div className="blog-meta">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Promo Night Scene */}
      <section id="app" className="section night-scene section-padding">
        <div className="night-illustration"></div>
        <div className="container">
          <div className="two-column" style={{ alignItems: 'center' }}>
            <div>
              <h2 className="text-white mb-8">Be our buddy!</h2>
              <p className="text-white mb-8" style={{ opacity: 0.9 }}>
                Download the Camp Buddy app for easy booking, real-time updates, and direct communication with camp counselors.
              </p>
              
              <div className="qr-code">
                📱
              </div>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{
                  background: 'white',
                  color: 'black',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📱 App Store
                </div>
                <div style={{
                  background: 'white',
                  color: 'black', 
                  padding: '12px 24px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🤖 Google Play
                </div>
              </div>
            </div>
            
            <div className="phones-container">
              <div className="phone-mockup phone-1">
                <div className="phone-screen">
                  🏠
                </div>
              </div>
              <div className="phone-mockup phone-2">
                <div className="phone-screen">
                  💬
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <TreePine size={28} color="#1F4A33" />
                <span style={{ fontSize: '24px', fontWeight: '700' }}>Camp Buddy</span>
              </div>
              <p>
                Connecting families with trusted, verified summer camps for safe and memorable experiences.
              </p>
              <div className="newsletter">
                <input type="email" placeholder="Enter your email" />
                <button className="btn btn-primary" style={{ padding: '12px 20px' }}>
                  Subscribe
                </button>
              </div>
            </div>
            
            <div>
              <div className="footer-title">Product</div>
              <a href="#" className="footer-link">Find Camps</a>
              <a href="#" className="footer-link">Camp Partners</a>
              <a href="#" className="footer-link">Safety Standards</a>
              <a href="#" className="footer-link">Mobile App</a>
            </div>
            
            <div>
              <div className="footer-title">Company</div>
              <a href="#" className="footer-link">About Us</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Press</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
            
            <div>
              <div className="footer-title">Resources</div>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Safety Guide</a>
              <a href="#" className="footer-link">Parent Tips</a>
              <a href="#" className="footer-link">Help Center</a>
            </div>
            
            <div>
              <div className="footer-title">Follow us</div>
              <div className="social-links">
                <a href="#" className="social-link">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-link">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-link">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-link">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div>© 2024 Camp Buddy. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}