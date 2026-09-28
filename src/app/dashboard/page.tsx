'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLearning } from '../../context/LearningContext'
import ProgressBar from '../../components/common/ProgressBar'

export default function DashboardPage() {
  const {
    courses,
    badges,
    progress,
    isLoaded,
    getCourseProgress,
    toggleGoal,
    addCustomGoal,
    resetProgress
  } = useLearning()

  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState(3)
  const [newGoalUnit, setNewGoalUnit] = useState('lessons')
  const [newGoalPeriod, setNewGoalPeriod] = useState<'daily' | 'weekly'>('weekly')
  const [showAddModal, setShowAddModal] = useState(false)



  const enrolledCourses = courses.filter((c) =>
    progress.enrolledCourseIds.includes(c.id)
  )

  const completedLecturesCount = progress.completedLectureIds.length
  const quizzesPassedCount = Object.values(progress.quizAttempts).filter(
    (a) => a.passed
  ).length

  // Calculate Student Level
  const studentLevel = Math.floor(progress.xp / 200) + 1
  const xpIntoCurrentLevel = progress.xp % 200
  const levelProgress = Math.round((xpIntoCurrentLevel / 200) * 100)

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalTitle.trim()) return
    addCustomGoal(newGoalTitle, newGoalTarget, newGoalUnit, newGoalPeriod)
    setNewGoalTitle('')
    setShowAddModal(false)
  }

  return (
    <div>
      {/* Student Banner */}
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
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            🎓
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Student Learning Hub</h1>
              <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 700 }}>
                Level {studentLevel} Scholar
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Keep learning daily to grow your streak and conquer tech roadmaps.
            </p>

            <div style={{ width: '220px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Level {studentLevel}</span>
                <span>{xpIntoCurrentLevel}/200 XP to Level {studentLevel + 1}</span>
              </div>
              <ProgressBar value={levelProgress} height={6} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => {
              if (confirm('Reset your demo progress back to initial default?')) {
                resetProgress()
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '12px', opacity: 0.8 }}
          >
            Reset Demo Progress ↺
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}
      >
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Current Streak
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔥</span> {progress.streakDays} Days
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Daily study active</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Total Experience
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> {progress.xp} XP
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Earned from lessons & quizzes</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Lectures Completed
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📹</span> {completedLecturesCount}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Across enrolled courses</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Quizzes Passed
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📝</span> {quizzesPassedCount}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Skill assessments cleared</span>
        </div>
      </div>

      {/* Goals Management Section */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Personal Study Goals</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Set actionable study milestones and track daily/weekly consistency.
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-secondary btn-sm">
            + Add Custom Goal
          </button>
        </div>

        {/* Goals List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {progress.goals.map((goal) => (
            <div
              key={goal.id}
              className="card"
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                borderLeft: `4px solid ${goal.completed ? 'var(--success)' : 'var(--brand-primary)'}`
              }}
            >
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
                style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, textDecoration: goal.completed ? 'line-through' : 'none', color: goal.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {goal.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {goal.period.toUpperCase()} • {goal.currentCount}/{goal.targetCount} {goal.unit}
                </div>
              </div>

              <span style={{ fontSize: '12px', fontWeight: 700, color: goal.completed ? 'var(--success)' : 'var(--brand-primary)' }}>
                {goal.completed ? 'Done ✓' : '+20 XP'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding Custom Goal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px'
          }}
        >
          <div className="card" style={{ padding: '28px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
              Create New Learning Goal
            </h3>

            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finish 2 TypeScript lectures"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Target Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Period
                  </label>
                  <select
                    value={newGoalPeriod}
                    onChange={(e) => setNewGoalPeriod(e.target.value as 'daily' | 'weekly')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrolled Courses Progress */}
      <div style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          Enrolled Courses ({enrolledCourses.length})
        </h2>

        {enrolledCourses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {enrolledCourses.map((c) => {
              const prog = getCourseProgress(c.id)
              const firstLecture = c.modules[0]?.lectures[0]

              return (
                <div
                  key={c.id}
                  className="card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px', flex: 1 }}>
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      style={{ width: '80px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{c.title}</h4>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {prog.completedCount} of {prog.totalCount} lectures completed
                      </span>
                    </div>
                  </div>

                  <div style={{ minWidth: '180px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      <span>Course Completion</span>
                      <strong style={{ color: 'var(--brand-primary)' }}>{prog.percentage}%</strong>
                    </div>
                    <ProgressBar value={prog.percentage} height={6} />
                  </div>

                  <div>
                    {firstLecture && (
                      <Link
                        href={`/courses/${c.id}/learn/${firstLecture.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Resume Course ▶
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>You haven't enrolled in any courses yet.</p>
            <Link href="/courses" className="btn btn-primary" style={{ marginTop: '12px' }}>
              Explore Course Catalog
            </Link>
          </div>
        )}
      </div>

      {/* Badges & Achievements Gallery */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
          Achievements & Badges
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Earn badges by reaching learning streaks, passing quizzes, and mastering career roadmaps.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {badges.map((badge) => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id)

            return (
              <div
                key={badge.id}
                className="card"
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  opacity: isUnlocked ? 1 : 0.45,
                  filter: isUnlocked ? 'none' : 'grayscale(80%)',
                  border: isUnlocked ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
                  background: isUnlocked ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>
                  {badge.icon}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                  {badge.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {badge.description}
                </p>
                <div style={{ marginTop: '12px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: isUnlocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      color: isUnlocked ? 'var(--success)' : 'var(--text-muted)'
                    }}
                  >
                    {isUnlocked ? '✓ UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
