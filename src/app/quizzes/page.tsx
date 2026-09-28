'use client'

import React, { useState } from 'react'
import { useLearning } from '../../context/LearningContext'
import QuizCard from '../../components/quiz/QuizCard'

export default function QuizzesPage() {
  const { quizzes, progress } = useLearning()
  const [selectedLevel, setSelectedLevel] = useState<string>('All')

  const levels = ['All', 'Beginner', 'Intermediate']

  const filteredQuizzes = quizzes.filter((quiz) =>
    selectedLevel === 'All' ? true : quiz.level === selectedLevel
  )

  const completedCount = Object.values(progress.quizAttempts).filter(
    (a) => a.passed
  ).length

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '8px' }}>
            <span>⚡</span> Knowledge Checks & Assessments
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            Skill Quizzes & Assessments
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '650px' }}>
            Validate your understanding, earn XP for your student profile, and unlock achievements.
          </p>
        </div>

        {/* Stats Pill */}
        <div
          className="card"
          style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success)' }}>
              {completedCount} / {quizzes.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quizzes Passed</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'var(--border-color)' }} />
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-primary)' }}>
              {progress.xp}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Student XP</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`btn btn-sm ${selectedLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      <div className="grid-2">
        {filteredQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  )
}
