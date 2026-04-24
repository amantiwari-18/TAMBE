import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({
  title = 'Tambe Global - Precision Engineered Automotive Components',
  description = 'Leading manufacturer of precision-engineered vehicle gears, transmission systems, and mechanical components. ISO certified quality with 25+ years of automotive excellence.',
  keywords = 'precision gears, automotive components, vehicle gears, transmission systems, mechanical parts, custom components, drive shafts, differential gears, clutch systems, automotive engineering, ISO certified, Tambe Global',
  author = 'Tambe Global',
  image = 'https://tambeglobal.com/og-image.jpg',
  url = 'https://tambeglobal.com',
  type = 'website',
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tambe Global",
    "url": "https://tambeglobal.com",
    "logo": "https://tambeglobal.com/logo.png",
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Industrial Estate",
      "addressRegion": "Precision Park",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "Customer Service",
      "email": "info@tambe.engineering",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/tambeglobal",
      "https://twitter.com/tambeglobal",
      "https://www.instagram.com/tambeglobal",
      "https://www.facebook.com/tambeglobal"
    ],
    "founder": {
      "@type": "Person",
      "name": "Tambe"
    },
    "foundingDate": "1999",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "200+"
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Tambe Global Products",
    "description": "Precision-engineered automotive components",
    "itemListElement": [
      {
        "@type": "Product",
        "name": "Precision Gears",
        "description": "High-performance gears engineered for maximum durability and efficiency",
        "brand": "Tambe Global",
        "category": "Automotive Parts"
      },
      {
        "@type": "Product",
        "name": "Transmission Systems",
        "description": "Complete transmission solutions for modern vehicles",
        "brand": "Tambe Global",
        "category": "Automotive Parts"
      },
      {
        "@type": "Product",
        "name": "Drive Shafts",
        "description": "Premium drive shafts built for performance and longevity",
        "brand": "Tambe Global",
        "category": "Automotive Parts"
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Tambe Global" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@tambeglobal" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#D4AF37" />
      <meta name="msapplication-TileColor" content="#D4AF37" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Precision Park" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
