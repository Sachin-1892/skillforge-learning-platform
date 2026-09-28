'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLearning } from '../context/LearningContext'
import { usePerformance, PerformanceMode } from '../context/PerformanceContext'

export const Navbar: React.FC = () => {
  const pathname = usePathname()
  const { progress, isLoaded } = useLearning()
  const { mode, effectiveMode, isLowEndDetected, deviceInfo, setMode } = usePerformance()
  const [showPerfMenu, setShowPerfMenu] = useState(false)

  const navLinks = [
    { href: '/', label: 'Explore' },
    { href: '/courses', label: 'Courses' },
    { href: '/roadmaps', label: 'Roadmaps' },
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/dashboard', label: 'My Dashboard' }
  ]

  const getModeLabel = () => {
    if (mode === 'auto') {
      return `⚙️ Auto (${effectiveMode === 'lite' ? '⚡ Lite' : '✨ HD'})`
    }
    if (mode === 'lite') {
      return '⚡ Lite Mode'
    }
    return '✨ HD Mode'
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'url(#brandGrad)' }}>
            <defs>
              <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
          SkillForge
        </Link>

        {/* Navigation Links */}
        <nav className="navbar-links">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions & Performance Switch */}
        <div className="navbar-actions">
          {/* Performance Switch Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPerfMenu(!showPerfMenu)}
              className="stat-pill"
              style={{
                cursor: 'pointer',
                borderColor: effectiveMode === 'lite' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)',
                background: effectiveMode === 'lite' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                color: effectiveMode === 'lite' ? 'var(--success)' : '#818cf8'
              }}
              title="Click to change Performance Mode"
            >
              <span>{getModeLabel()}</span>
            </button>

            {/* Performance Dropdown Menu */}
            {showPerfMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '240px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 100
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  DEVICE PERFORMANCE
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => {
                      setMode('auto')
                      setShowPerfMenu(false)
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: mode === 'auto' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: mode === 'auto' ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    ⚙️ Auto Detect (Recommended)
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
                      Adapts based on CPU & network
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setMode('lite')
                      setShowPerfMenu(false)
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: mode === 'lite' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      color: mode === 'lite' ? 'var(--success)' : 'var(--text-secondary)'
                    }}
                  >
                    ⚡ Lite Mode (Ultra-Fast)
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
                      Zero blur, low RAM & data saver
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setMode('high')
                      setShowPerfMenu(false)
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: mode === 'high' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                      color: mode === 'high' ? '#c084fc' : 'var(--text-secondary)'
                    }}
                  >
                    ✨ High Quality
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
                      Full glassmorphism & animations
                    </div>
                  </button>
                </div>

                {deviceInfo.cores && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Detected: {deviceInfo.cores} Cores • {deviceInfo.memoryGb || '4+'}GB RAM {deviceInfo.saveData ? '• Data Saver On' : ''}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Student Live Stats */}
          {isLoaded && (
            <>
              <div className="stat-pill streak" title="Current Daily Streak">
                <span>🔥</span>
                <span>{progress.streakDays}d</span>
              </div>
              <div className="stat-pill xp" title="Total XP Earned">
                <span>⚡</span>
                <span>{progress.xp} XP</span>
              </div>
            </>
          )}

          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Student Hub
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar