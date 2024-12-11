import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Drag and Drop Builder',
  description: 'A drag and drop interface builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

