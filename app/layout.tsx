import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import BodyAttributesHandler from './components/BodyAttributesHandler'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Twilio Voice App',
  description: 'A mobile app with Twilio Voice integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BodyAttributesHandler />
        {children}
        <Toaster />
      </body>
    </html>
  )
}