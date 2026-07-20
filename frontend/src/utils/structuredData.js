// Structured Data / Schema.org utilities for SEO

export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://sinterklaasgenk.be/#organization",
  "name": "Sinterklaas Genk",
  "alternateName": ["Studio Wonderland", "Sinterklaas en de Wensmachine"],
  "description": "Sinterklaas en de Wensmachine is een magische familievoorstelling in de Stadsschouwburg Genk (Limburg, België): een mix van live theater, film, muziek en dans. Georganiseerd door Studio Wonderland vzw in samenwerking met Stad Genk.",
  "url": "https://sinterklaasgenk.be",
  "logo": "https://sinterklaasgenk.be/media/SW_HQ_Logo.png",
  "image": "https://sinterklaasgenk.be/og-image.jpg",
  "email": "info@sinterklaasgenk.be",
  "priceRange": "€11 - €13",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Genk",
    "addressRegion": "Limburg", 
    "addressCountry": "BE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "50.9644",
    "longitude": "5.5004"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Genk"
    },
    {
      "@type": "State", 
      "name": "Limburg"
    },
    {
      "@type": "Country",
      "name": "België"
    },
    {
      "@type": "State",
      "name": "Vlaanderen"
    }
  ],
  "serviceType": "Sinterklaasshow",
  "services": [
    "Sinterklaas voorstellingen",
    "Sinterklaas aankomst",
    "Theater shows",
    "Kinderanimatie",
    "Event entertainment"
  ],
  "sameAs": [
    "https://sinterklaasgenk.be"
  ]
});

export const getEventSchema = (eventData) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": eventData.name || "Sinterklaasshow Genk",
  "description": eventData.description || "Magische Sinterklaasvoorstelling voor het hele gezin in Genk, Limburg",
  "startDate": eventData.startDate,
  "endDate": eventData.endDate,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": eventData.venue || "Genk",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Genk",
      "addressRegion": "Limburg",
      "addressCountry": "BE"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Sinterklaas Genk",
    "url": "https://sinterklaasgenk.be"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "families with children"
  },
  "keywords": "sinterklaas genk, sinterklaasshow limburg, sinterklaas vlaanderen"
});

export const getArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "author": {
    "@type": "Organization",
    "name": "Sinterklaas Genk"
  },
  "publisher": {
    "@type": "Organization", 
    "name": "Sinterklaas Genk",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sinterklaasgenk.be/media/SW_HQ_Logo.png"
    }
  },
  "datePublished": article.date,
  "dateModified": article.updatedAt || article.date,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://sinterklaasgenk.be/nieuws/${article.slug}`
  },
  "image": article.featured_image ? {
    "@type": "ImageObject",
    "url": article.featured_image
  } : undefined,
  "keywords": `sinterklaas genk, sinterklaas limburg, ${article.category}, sinterklaasshow`
});

export const getBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const getFAQSchema = (faqItems = []) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": (item.answer || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    }
  }))
});


export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://sinterklaasgenk.be/#website",
  "url": "https://sinterklaasgenk.be",
  "name": "Sinterklaas Genk",
  "description": "De meest magische Sinterklaasshow in Genk, Limburg. Boek nu uw Sinterklaas voorstelling!",
  "publisher": {
    "@id": "https://sinterklaasgenk.be/#organization"
  },
  "potentialAction": [
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sinterklaasgenk.be/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  ],
  "inLanguage": "nl-BE"
});