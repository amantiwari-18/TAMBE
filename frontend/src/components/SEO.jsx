import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({
  title = 'Tambe Tools - Precision Engineering Tools & Equipment',
  description = 'Leading manufacturer of precision-engineered tools and equipment. Quality craftsmanship with innovative design for professionals.',
  keywords = 'precision tools, engineering tools, professional equipment, Tambe Tools, quality tools, industrial tools, manufacturing tools, construction equipment',
  author = 'Tambe Tools',
  image = 'https://tambetools.com/og-image.jpg',
  url = 'https://tambetools.com',
  type = 'website',
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tambe Tools",
    "url": "https://tambetools.com",
    "logo": "https://tambetools.com/logo.png",
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
      "email": "info@tambetools.com",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/tambetools",
      "https://twitter.com/tambetools",
      "https://www.instagram.com/tambetools",
      "https://www.facebook.com/tambetools"
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
    "name": "Tambe Tools Products",
    "description": "Precision-engineered tools and equipment",
    "itemListElement": [
      {
        "@type": "Product",
        "name": "Precision Tools",
        "description": "High-performance tools engineered for maximum durability and efficiency",
        "brand": "Tambe Tools",
        "category": "Professional Equipment"
      },
      {
        "@type": "Product",
        "name": "Industrial Equipment",
        "description": "Complete equipment solutions for modern professionals",
        "brand": "Tambe Tools",
        "category": "Industrial Tools"
      },
      {
        "@type": "Product",
        "name": "Engineering Tools",
        "description": "Premium engineering tools built for performance and longevity",
        "brand": "Tambe Tools",
        "category": "Professional Equipment"
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
      <meta property="og:site_name" content="Tambe Tools" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@tambetools" />
      
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
