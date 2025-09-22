import { Providers } from '@/components/providers'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OrganizeKids - Organize Your Family Life',
  description:
    'Help your family stay organized with tasks, rewards, and household management.',
  keywords: ['family', 'organization', 'kids', 'tasks', 'rewards', 'household'],
  authors: [{ name: 'OrganizeKids Team' }],
  openGraph: {
    title: 'OrganizeKids - Organize Your Family Life',
    description:
      'Help your family stay organized with tasks, rewards, and household management.',
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
    <html lang='pt' suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
