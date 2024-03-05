import { MetadataRoute } from 'next';

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
    sitemap: 'https://next-kaccha-pacca-invoices.vercel.app/sitemap.xml',
  };
}
