'use client'

import React, { useState } from 'react'
import { useLearning } from '../../context/LearningContext'
import { usePerformance } from '../../context/PerformanceContext'
import { INITIAL_BADGES, INITIAL_COURSES, INITIAL_QUIZZES, INITIAL_ROADMAPS } from '../../data/mockData'

export const QATestingToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { progress, resetProgress, courses } = useLearning()
  const { mode, effectiveMode, setMode, deviceInfo } = usePerformance()

  // Scenario: Fresh Student (Day 1, 0% Progress)
  const loadFreshStudent = () => {
    const freshState = {
      enrolledCourseIds: [],
      completedLectureIds: [],
      quizAttempts: {},
      completedMilestoneIds: [],
      goals: [
        {
          id: 'goal-lectures',
          title: 'Complete 3 Lectures this week',
          targetCount: 3,
          currentCount: 0,
          unit: 'lectures',
          period: 'weekly' as const,
          completed: false
        }
      ],
      xp: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: []
    }
    localStorage.setItem('skillforge_student_progress_v1', JSON.stringify(freshState))
    window.location.reload()
  }

  // Scenario: Graduate Master (100% Everything Completed)
  const loadGraduateMaster = () => {
    const allCourseIds = courses.map((c) => c.id)
    const allLectureKeys = courses.flatMap((c) =>
      c.modules.flatMap((m) => m.lectures.map((l) => `${c.id}:${l.id}`))
    )
    const allMilestoneIds = INITIAL_ROADMAPS.flatMap((r) => r.milestones.map((m) => m.id))
    const perfectQuizzes: Record<string, any> = {}
    INITIAL_QUIZZES.forEach((q) => {
      perfectQuizzes[q.id] = {
        quizId: q.id,
        score: q.questions.length,
        totalQuestions: q.questions.length,
        passed: true,
        attemptedAt: new Date().toISOString()
      }
    })

    const graduateState = {
      enrolledCourseIds: allCourseIds,
      completedLectureIds: allLectureKeys,
      quizAttempts: perfectQuizzes,
      completedMilestoneIds: allMilestoneIds,
      goals: [
        {
          id: 'goal-lectures',
          title: 'Complete 3 Lectures this week',
          targetCount: 3,
          currentCount: 3,
          unit: 'lectures',
          period: 'weekly' as const,
          completed: true
        }
      ],
      xp: 2850,
      streakDays: 24,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: INITIAL_BADGES.map((b) => b.id)
    }
    localStorage.setItem('skillforge_student_progress_v1', JSON.stringify(graduateState))
    window.location.reload()
  }

  return (
    <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#f8fafc',
          border: '1px solid rgba(99, 102, 241, 0.5)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        <span>🛠️ QA Tester Toolbar</span>
        <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: effectiveMode === 'lite' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: effectiveMode === 'lite' ? 'var(--success)' : '#818cf8' }}>
          {effectiveMode.toUpperCase()}
        </span>
      </button>

      {/* Drawer Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            right: 0,
            width: '320px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800 }}>🧪 QA Testing Controls</h4>
            <button
              onClick={() => setIsOpen(false)}
              style={{ fontSize: '14px', color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Switch between student personas and hardware tiers instantly to test edge cases:
          </p>

          {/* Student Personas */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Student Personas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={loadFreshStudent}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '12px' }}
              >
                🐣 <strong>Fresh Student</strong> (0 XP, 0% Progress)
              </button>

              <button
                onClick={loadGraduateMaster}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '12px' }}
              >
                🎓 <strong>Graduate Master</strong> (100% Done, All Badges)
              </button>

              <button
                onClick={() => {
                  resetProgress()
                  window.location.reload()
                }}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '12px' }}
              >
                🔄 <strong>Reset to Demo Default</strong>
              </button>
            </div>
          </div>

          {/* Hardware & Network Simulator */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Hardware & Device Mode
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                onClick={() => setMode('lite')}
                className={`btn btn-sm ${mode === 'lite' ? 'btn-success' : 'btn-secondary'}`}
                style={{ fontSize: '11px' }}
              >
                ⚡ Force Lite
              </button>
              <button
                onClick={() => setMode('high')}
                className={`btn btn-sm ${mode === 'high' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px' }}
              >
                ✨ Force HD
              </button>
            </div>
          </div>

          {/* Current Live Stats */}
          <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', fontSize: '11px', color: 'var(--text-muted)' }}>
            <div>XP: <strong>{progress.xp}</strong> • Streak: <strong>{progress.streakDays}d</strong></div>
            <div>Enrolled: <strong>{progress.enrolledCourseIds.length}</strong> courses</div>
            <div>Detected: <strong>{deviceInfo.cores || 4} cores</strong>, <strong>{deviceInfo.memoryGb || '4+'}GB RAM</strong></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QATestingToolbar
