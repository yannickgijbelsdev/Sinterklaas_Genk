import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  structuredData,
  noindex = false
}) => {
  const siteUrl = 'https://sinterklaasgenk.be';
  const defaultTitle = 'Sinterklaas Genk - De Meest Magische Sinterklaasshow in Limburg';
  const defaultDescription = 'Boek nu de meest magische Sinterklaasshow in Genk, Limburg! Professionele Sinterklaas voorstellingen voor het hele gezin. Sinterklaas aankomst en shows door heel Vlaanderen en België.';
  const defaultKeywords = 'sinterklaas genk, sinterklaas limburg, sinterklaasshow, sinterklaas belgië, sinterklaas vlaanderen, sinterklaas aankomst, sinterklaas voorstelling, sinterklaas boeken genk, sinterklaas theater limburg, sinterklaas activiteiten genk';
  
  const finalTitle = title ? `${title} | Sinterklaas Genk` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDescription = ogDescription || finalDescription;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={`${siteUrl}${canonicalUrl}`} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={`${siteUrl}${canonicalUrl || ''}`} />
      <meta property="og:site_name" content="Sinterklaas Genk" />
      <meta property="og:locale" content="nl_BE" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Local Business Schema */}
      <meta name="geo.region" content="BE-VLI" />
      <meta name="geo.placename" content="Genk, Limburg" />
      <meta name="ICBM" content="50.9644, 5.5004" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="nl-BE" />
      <meta name="language" content="Dutch" />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;