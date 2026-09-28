'use client'

import React from 'react'
import Link from 'next/link'
import { Quiz } from '../../types/learning'
import { BadgePill } from '../common/BadgePill'
import { useLearning } from '../../context/LearningContext'

interface QuizCardProps {
  quiz: Quiz
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const { progress } = useLearning()
  const attempt = progress.quizAttempts[quiz.id]

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <BadgePill level={quiz.level} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-primary)' }}>
          +{quiz.xpReward} XP
        </span>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
        {quiz.title}
      </h3>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Topic: {quiz.topic} • {quiz.questions.length} Questions
      </p>

      {attempt ? (
        <div
          style={{
            padding: '12px',
            borderRadius: '8px',
            background: attempt.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${attempt.passed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            marginBottom: '16px',
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontWeight: 600, color: attempt.passed ? 'var(--success)' : 'var(--danger)' }}>
            {attempt.passed ? '✓ Passed' : 'Needs Review'}
          </span>
          <span style={{ fontWeight: 700 }}>
            {attempt.score} / {attempt.totalQuestions} ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%)
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <span>⏱️ {quiz.timeLimitMinutes} mins</span>
          <span>🎯 Passing: 60%</span>
        </div>
      )}

      <div style={{ marginTop: 'auto' }}>
        <Link
          href={`/quiz/${quiz.id}`}
          className={`btn ${attempt ? 'btn-secondary' : 'btn-primary'}`}
          style={{ width: '100%', textAlign: 'center' }}
        >
          {attempt ? 'Retake Assessment ↺' : 'Start Assessment →'}
        </Link>
      </div>
    </div>
  )
}

export default QuizCard
