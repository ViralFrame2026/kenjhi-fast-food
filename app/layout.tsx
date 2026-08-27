import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kenjhi Fast Food | Pedí online',
  description: 'Hamburguesas, pizzas, tacos, burritos y mucho más en San Justo, Santa Fe.',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Kenjhi Fast Food',
    description: 'El antojo empieza acá.',
    type: 'website'
  }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es"><body>{children}</body></html>;
}
