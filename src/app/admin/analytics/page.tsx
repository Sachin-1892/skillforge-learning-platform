'use client'

import React from 'react'
import Link from 'next/link'
import { useLearning } from '../../../context/LearningContext'
import ProgressBar from '../../../components/common/ProgressBar'

export default function AdminAnalyticsPage() {
  const { courses, quizzes, roadmaps, progress } = useLearning()

  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrolledStudentsCount, 0)
  const averageRating = (
    courses.reduce((acc, c) => acc + c.rating, 0) / (courses.length || 1)
  ).toFixed(2)

  const quizAttemptsList = Object.values(progress.quizAttempts)
  const passedQuizzes = quizAttemptsList.filter((a) => a.passed).length
  const passRate = quizAttemptsList.length > 0
    ? Math.round((passedQuizzes / quizAttemptsList.length) * 100)
    : 85

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
          <Link href="/admin" style={{ color: 'var(--text-secondary)' }}>Admin Studio</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>Analytics</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Platform & Student Engagement Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Real-time metrics on course popularity, quiz pass rates, and learning milestones.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Total Student Enrollments
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)' }}>
            👥 {totalEnrollments.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--success)' }}>+14.2% this month</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Average Student Satisfaction
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)' }}>
            ⭐ {averageRating} / 5.0
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>From verified reviews</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Average Quiz Pass Rate
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>
            🎯 {passRate}%
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Passing grade $\ge$ 60%</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Active Learning Streaks
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#f43f5e' }}>
            🔥 {progress.streakDays} Days
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Daily active learner count</span>
        </div>
      </div>

      {/* Course Engagement Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            Course Enrollment Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courses.map((course) => {
              const share = totalEnrollments > 0
                ? Math.round((course.enrolledStudentsCount / totalEnrollments) * 100)
                : 25

              return (
                <div key={course.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{course.title}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {course.enrolledStudentsCount.toLocaleString()} ({share}%)
                    </span>
                  </div>
                  <ProgressBar value={share} height={6} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Assessment Health */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            Knowledge Assessment Health
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {quizzes.map((q) => (
              <div
                key={q.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{q.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {q.topic} • {q.questions.length} Questions
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    +{q.xpReward} XP
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--success)' }}>Active Assessment</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
