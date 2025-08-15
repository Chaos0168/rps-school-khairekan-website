import './globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'RPS School Khairekan - Excellence in Education | CBSE Affiliated',
  description: 'Leading CBSE affiliated school in Khairekan providing quality education, character building and holistic development. Admissions open for 2026-27.',
  keywords: 'RPS School, Khairekan, CBSE school, Indian education, admissions, quality education, character building, holistic development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body className="font-english">{children}</body>
    </html>
  )
} 