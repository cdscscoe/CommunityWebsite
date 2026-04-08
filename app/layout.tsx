import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'CDSC@SCOE — Computer Department Student Community',
  description: 'The first student-led technical community at Siddhant College of Engineering. Built by students, for students. Build. Share. Grow.',
  keywords: ['CDSC', 'SCOE', 'Siddhant College', 'Computer Engineering', 'Student Community', 'Pune'],
  openGraph: {
    title: 'CDSC@SCOE',
    description: 'First student-led community at SCOE. Build. Share. Grow.',
    url: 'https://cdsc-scoe.vercel.app',
    siteName: 'CDSC@SCOE',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ONE font link for the entire app — nowhere else */}
        <link
  href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
      </head>
      <body className="noise-overlay">{children}</body>
    </html>
  )
}