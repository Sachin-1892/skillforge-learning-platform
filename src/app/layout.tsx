import type { Metadata } from 'next'
import './globals.css'
import { LearningProvider } from '../context/LearningContext'
import { PerformanceProvider } from '../context/PerformanceContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import QATestingToolbar from '../components/common/QATestingToolbar'

export const metadata: Metadata = {
  title: 'SkillForge - Modern Student Learning Platform',
  description: 'Master in-demand tech skills through structured courses, interactive lectures, skill roadmaps, and knowledge assessments.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PerformanceProvider>
          <LearningProvider>
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                {children}
              </main>
              <Footer />
              <QATestingToolbar />
            </div>
          </LearningProvider>
        </PerformanceProvider>
      </body>
    </html>
  )
}
