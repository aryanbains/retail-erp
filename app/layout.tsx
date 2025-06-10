import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { ToastProvider } from '@/components/providers/toast-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Retail ERP System',
  description: 'Enterprise Resource Planning for Retail Business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  )
}