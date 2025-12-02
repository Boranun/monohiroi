import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/room/'],
    },
    sitemap: 'https://repo-tracker.vercel.app/sitemap.xml', // 実際のURLに変更
  };
}