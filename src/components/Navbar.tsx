'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLearning } from '../context/LearningContext'
import { usePerformance } from '../context/PerformanceContext'

export const Navbar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { progress, isLoaded, role, setRole } = useLearning()
  const { mode, effectiveMode, setMode, deviceInfo } = usePerformance()
  const [showPerfMenu, setShowPerfMenu] = useState(false)

  const isAdminView = pathname.startsWith('/admin') || role === 'admin'

  const studentNavLinks = [
    { href: '/', label: 'Explore' },
    { href: '/courses', label: 'Courses' },
    { href: '/roadmaps', label: 'Roadmaps' },
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/dashboard', label: 'My Dashboard' }
  ]

  const adminNavLinks = [
    { href: '/admin', label: '📊 Overview' },
    { href: '/admin/courses', label: '📚 Courses' },
    { href: '/admin/quizzes', label: '⚡ Quizzes' },
    { href: '/admin/roadmaps', label: '🗺️ Roadmaps' },
    { href: '/admin/analytics', label: '📈 Analytics' }
  ]

  const navLinks = isAdminView ? adminNavLinks : studentNavLinks

  const handleRoleToggle = () => {
    if (isAdminView) {
      setRole('student')
      router.push('/')
    } else {
      setRole('admin')
      router.push('/admin')
    }
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href={isAdminView ? '/admin' : '/'} className="navbar-brand">
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

          {/* Active Panel Badge */}
          <span
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 700,
              letterSpacing: '0.4px',
              background: isAdminView ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: isAdminView ? '#fb7185' : '#818cf8',
              border: `1px solid ${isAdminView ? 'rgba(244, 63, 94, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
            }}
          >
            {isAdminView ? 'ADMIN STUDIO' : 'STUDENT PORTAL'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-links">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/' || link.href === '/admin'
                ? pathname === link.href
                : pathname.startsWith(link.href)
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

        {/* Actions & Role Switcher */}
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
                    Detected: {deviceInfo.cores} Cores • {deviceInfo.memoryGb || '4+'}GB RAM
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Student Stats (shown in student view) */}
          {!isAdminView && isLoaded && (
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

          {/* Master Panel Switcher Button */}
          <button
            onClick={handleRoleToggle}
            className={`btn btn-sm ${isAdminView ? 'btn-secondary' : 'btn-primary'}`}
            style={{ fontWeight: 700 }}
            title={isAdminView ? 'Switch to Student View' : 'Switch to Admin Management Studio'}
          >
            {isAdminView ? '🎓 Student View' : '🛠️ Admin Studio'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar