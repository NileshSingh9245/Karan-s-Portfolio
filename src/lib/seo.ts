import { Metadata } from "next";

export const siteConfig = {
  name: "Karan - Digital Marketing & Creative Freelancer",
  description:
    "Professional Digital Marketing & Creative Freelancer specializing in Instagram Reels, Video Editing, Social Media Management, and Graphic Design. Helping Indian businesses grow online.",
  url: "https://yourdomain.com", // Replace with your actual domain
  ogImage: "/og-image.jpg",
  creator: "Karan",
  keywords: [
    "digital marketing freelancer",
    "instagram reels creator",
    "video editor india",
    "social media manager",
    "graphic designer",
    "content creator",
    "freelance video editor",
    "instagram growth",
    "social media marketing india",
  ],
};

export function generateSEO({
  title,
  description,
  image,
  url,
  keywords,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = url || siteConfig.url;
  const pageKeywords = keywords || siteConfig.keywords;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: "@yourusername", // Replace with your Twitter handle
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: siteConfig.ogImage,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      addressCountry: "IN",
    },
    priceRange: "₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "50+",
    },
  };
}

export function generateServiceSchema(service: {
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: {
      "@type": "Person",
      name: siteConfig.creator,
    },
    description: service.description,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}
