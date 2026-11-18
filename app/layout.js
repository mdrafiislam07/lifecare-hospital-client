import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: { default: 'Life Care Hospital | Jamalpur', template: '%s | Life Care Hospital' },
  description: '250-bed tertiary care hospital in Jamalpur. Doctor appointment, emergency, ambulance, checkup packages and more. Hotline 10622.',
  icons: { icon: '/favicon.svg' }
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0f9b8e' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
