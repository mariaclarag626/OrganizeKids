import { Providers } from '@/components/providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OrganizeKids - Organize Your Family Life',
  description: 'Help your family stay organized with tasks, rewards, and household management.',
  keywords: ['family', 'organization', 'kids', 'tasks', 'rewards', 'household'],
  authors: [{ name: 'OrganizeKids Team' }],
  openGraph: {
    title: 'OrganizeKids - Organize Your Family Life',
    description: 'Help your family stay organized with tasks, rewards, and household management.',
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}