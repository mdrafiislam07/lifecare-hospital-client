import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import AuthProvider from '@/components/AuthProvider';
import { getSettings } from '@/lib/content';

export const metadata = {
  title: { default: 'Apollo Hospital | Jamalpur', template: '%s | Apollo Hospital' },
  description: '250-bed tertiary care hospital in Jamalpur. Doctor appointment, emergency, ambulance, checkup packages and more. Hotline 10622.',
  icons: { icon: '/favicon.svg' }
};

// Mobile browser bar color: admin > Footer > "Mobile browser bar color" theke ashe (na thakle default blue)
export async function generateViewport() {
  const s = await getSettings();
  return { width: 'device-width', initialScale: 1, themeColor: s.themeColor || '#1f5fd6' };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <a href="#main" className="skip">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingContact />
        </AuthProvider>
      </body>
    </html>
  );
}