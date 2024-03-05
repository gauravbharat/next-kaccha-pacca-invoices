import { MetadataRoute } from 'next';

// generates robots.txt file
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/dashboard/',
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        allow: ['/'],
        disallow: '/dashboard/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: '/dashboard/',
      },
    ],
    sitemap: 'https://saas-accounts-basic.vercel.app/sitemap.xml',
  };
}
