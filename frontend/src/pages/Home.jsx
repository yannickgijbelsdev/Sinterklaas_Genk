import React, { useState, useEffect } from 'react';
import { 
  Gift, Star, Calendar, Clock, Users, Heart, Shield, Award, 
  CheckCircle, ArrowRight, Play, Download, Plus, Minus,
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube
} from 'lucide-react';
import { Button } from '../components/ui/button';
import '../styles/camp-buddy-theme.css';

export default function Home() {
  const [showCurtain, setShowCurtain] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const { data: newsData } = useNews();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const faqItems = [
    {
      question: "How do you ensure the safety of children at camps?",
      answer: "All our camp partners undergo rigorous background checks and maintain certified safety standards. We verify insurance, staff credentials, and safety protocols before partnering with any camp."
    },
    {
      question: "What's included in the camp fee?",
      answer: "Camp fees typically include all activities, meals, accommodation (for overnight camps), supervised activities, and safety equipment. Specific inclusions vary by camp and are clearly outlined in each listing."
    },
    {
      question: "Can I get a refund if my child can't attend?",
      answer: "Refund policies vary by camp partner. Most offer full refunds with adequate notice (usually 7-14 days). Emergency situations are handled case-by-case with our support team."
    },
    {
      question: "Do you accommodate children with special needs?",
      answer: "Yes! Many of our partner camps specialize in inclusive programs. During booking, you can specify any accommodations needed, and we'll match you with appropriate camps."
    },
    {
      question: "How are camp counselors vetted?",
      answer: "All counselors undergo background checks, reference verification, and training certification. We require camps to maintain detailed staff records and ongoing professional development."
    },
    {
      question: "What if there's an emergency during camp?",
      answer: "Every camp has emergency protocols and medical staff on-site. Parents receive immediate notification of any incidents, and our 24/7 support line is always available."
    },
    {
      question: "Can I visit the camp before booking?",
      answer: "Absolutely! We encourage camp visits. Use our scheduling feature to arrange tours, meet staff, and see facilities before making your decision."
    },
    {
      question: "What should my child bring to camp?",
      answer: "Each camp provides a detailed packing list after booking. Generally includes clothes, personal items, any medications, and specific gear for specialized activities."
    }
  ];

  const blogPosts = [
    {
      category: "Safety Tips",
      title: "10 Essential Safety Questions to Ask Any Summer Camp",
      excerpt: "Make sure your child's camp experience is safe and supervised with our comprehensive safety checklist...",
      date: "March 15, 2024",
      readTime: "5 min read",
      icon: "🛡️"
    },
    {
      category: "Camp Guide",
      title: "First-Time Camper? Here's What to Expect",
      excerpt: "Help your child prepare for their first camp adventure with tips from experienced counselors...",
      date: "March 12, 2024", 
      readTime: "3 min read",
      icon: "🏕️"
    },
    {
      category: "Parent Tips",
      title: "Dealing with Homesickness: A Parent's Guide",
      excerpt: "Learn effective strategies to help your child cope with being away from home for the first time...",
      date: "March 8, 2024",
      readTime: "4 min read", 
      icon: "💙"
    }
  ];

  if (!appReady) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFE7D3 0%, #FAD9BE 100%)'
      }}>
        <div>Loading Camp Buddy...</div>
      </div>
    );
  }

  return (
    <div>
      
      {/* Hero Section */}
      <section id="hero" className="hero" style={{ backgroundColor: '#FFFDF8', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="hero-content" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#FF9F47', marginBottom: '12px' }}>
              Parenting made easy
            </div>
            <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: '24px', color: '#2E3A2F' }}>
              Stay worry-free with Camp Buddy
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '20px', color: '#666', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              Connect with trusted, verified summer camps that match your child's interests and your family's needs.
            </p>
            <div className="hero-ctas" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                background: '#FF9F47',
                color: 'white',
                boxShadow: '0 8px 32px rgba(46, 58, 47, 0.08)'
              }}>
                <Play size={20} />
                Start a demo
              </button>
              <button className="btn btn-secondary" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                border: '2px solid #1F4A33',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                background: 'transparent',
                color: '#1F4A33'
              }}>
                <Download size={20} />
                Get the app
              </button>
            </div>
          </div>
          
          <div className="hero-illustration" style={{
            position: 'relative',
            height: '400px',
            background: 'linear-gradient(135deg, #E8F5E8 0%, #D4F1D4 100%)',
            borderRadius: '24px 24px 0 0',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 -20px'
          }}>
            <div style={{
              fontSize: '120px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <span>🏕️</span>
              <span>🔥</span>
              <span>👧</span>
              <span>👦</span>
              <span>🏔️</span>
            </div>
            {/* Wavy separator */}
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              right: 0,
              height: '60px',
              background: '#2E3A2F',
              clipPath: 'ellipse(100% 100% at 50% 0%)'
            }}></div>
          </div>
        </div>
      </section>

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