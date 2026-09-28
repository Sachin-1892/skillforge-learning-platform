'use client'

import React from 'react'
import Link from 'next/link'
import { useLearning } from '../../context/LearningContext'

export default function AdminDashboardPage() {
  const { courses, quizzes, roadmaps, progress, setRole } = useLearning()

  const totalCourses = courses.length
  const totalLectures = courses.reduce(
    (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lectures.length, 0),
    0
  )
  const totalQuizzes = quizzes.length
  const totalQuestions = quizzes.reduce((acc, q) => acc + q.questions.length, 0)
  const totalRoadmaps = roadmaps.length
  const totalStudents = courses.reduce((acc, c) => acc + c.enrolledStudentsCount, 0)

  return (
    <div>
      {/* Admin Welcome Header */}
      <div
        className="card"
        style={{
          padding: '32px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', fontWeight: 700 }}>
              ADMINISTRATION & MANAGEMENT STUDIO
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              SkillForge v1.0
            </span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>
            Executive Platform Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Publish courses, manage lecture playlists, author skill assessments, and monitor student engagement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin/courses" className="btn btn-primary btn-sm">
            + New Course
          </Link>
          <Link href="/admin/quizzes" className="btn btn-secondary btn-sm">
            + New Quiz
          </Link>
          <Link
            href="/"
            onClick={() => setRole('student')}
            className="btn btn-secondary btn-sm"
          >
            🎓 Preview Student View
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}
      >
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Total Published Courses
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📚</span> {totalCourses}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Across {new Set(courses.map(c => c.category)).size} categories
          </span>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Total Video Lectures
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📹</span> {totalLectures}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            With interactive notes & code
          </span>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Knowledge Quizzes
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚡</span> {totalQuizzes}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {totalQuestions} total questions authored
          </span>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Career Roadmaps
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🗺️</span> {totalRoadmaps}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Guided skill pathways
          </span>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Enrolled Students
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👥</span> {totalStudents.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Total platform enrollments
          </span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
        Administrative Management Hub
      </h2>

      <div className="grid-3" style={{ marginBottom: '40px' }}>
        {/* Manage Courses */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
            Course & Curriculum Manager
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1 }}>
            Create new courses, add modules, configure lecture video streams, companion notes, and downloadable starter files.
          </p>
          <Link href="/admin/courses" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
            Manage Courses ({courses.length}) →
          </Link>
        </div>

        {/* Manage Quizzes */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
            Quiz & Assessment Studio
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1 }}>
            Design multiple-choice assessments, define correct answer keys, write educational explanations, and allocate XP points.
          </p>
          <Link href="/admin/quizzes" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
            Manage Quizzes ({quizzes.length}) →
          </Link>
        </div>

        {/* Manage Roadmaps */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗺️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
            Career Roadmap Builder
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1 }}>
            Curate phase-by-phase tech roadmaps (Frontend, AI, Fullstack), write skill checklists, and connect corresponding platform courses.
          </p>
          <Link href="/admin/roadmaps" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
            Manage Roadmaps ({roadmaps.length}) →
          </Link>
        </div>
      </div>
    </div>
  )
}
