import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '16px', color: '#f8fafc' }}>
          <span>🚀</span> SkillForge Learning Platform
        </div>
        <p>
          Empowering students to achieve their tech goals through modular courses, interactive lectures, hands-on quizzes, and structured skill roadmaps.
        </p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', marginTop: '8px' }}>
          <Link href="/courses" style={{ color: 'var(--text-secondary)' }}>Courses</Link>
          <Link href="/roadmaps" style={{ color: 'var(--text-secondary)' }}>Roadmaps</Link>
          <Link href="/quizzes" style={{ color: 'var(--text-secondary)' }}>Quizzes</Link>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)' }}>My Dashboard</Link>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
          © {new Date().getFullYear()} SkillForge. Built for ambitious student developers.
        </div>
      </div>
    </footer>
  )
}

export default Footer
