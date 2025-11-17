import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://standby-app.vercel.app'),
  title: {
    default: 'StandBy - Dein selbstständiges Leben',
    template: '%s | StandBy',
  },
  description:
    'StandBy ist die All-in-One-App für dein selbstständiges Leben. Verwalte Budget, Rezepte, Kalender und Shopping-Listen an einem Ort.',
  keywords: [
    'Budget-Management',
    'Rezept-Verwaltung',
    'Kalender',
    'Shopping-Liste',
    'Studentenleben',
    'Finanzplanung',
    'Haushalt organisieren',
  ],
  authors: [{ name: 'StandBy Team' }],
  creator: 'StandBy',
  publisher: 'StandBy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: '/',
    title: 'StandBy - Dein selbstständiges Leben',
    description:
      'StandBy ist die All-in-One-App für dein selbstständiges Leben. Verwalte Budget, Rezepte, Kalender und Shopping-Listen an einem Ort.',
    siteName: 'StandBy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StandBy - Dein selbstständiges Leben',
    description:
      'StandBy ist die All-in-One-App für dein selbstständiges Leben. Verwalte Budget, Rezepte, Kalender und Shopping-Listen an einem Ort.',
    creator: '@standbyapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // TODO: Add verification codes after setting up Google Search Console and other services
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
