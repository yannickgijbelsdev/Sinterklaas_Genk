import React, { useEffect, useState } from 'react';

export const ScrollIndicator = ({ sections = [] }) => {
  const [activeSection, setActiveSection] = useState(sections[0] || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      let currentSection = sections[0];
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;
          
          if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
            currentSection = section;
          }
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (sections.length === 0) return null;

  return (
    <div className="scroll-indicator">
      {sections.map((section) => (
        <div
          key={section}
          className={`scroll-dot ${activeSection === section ? 'active' : ''}`}
          onClick={() => scrollToSection(section)}
          title={`Ga naar ${section}`}
        />
      ))}
    </div>
  );
};