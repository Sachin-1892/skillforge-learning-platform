'use client'

import React from 'react'
import Link from 'next/link'
import { RoadmapMilestone } from '../../types/learning'
import { useLearning } from '../../context/LearningContext'

interface RoadmapNodeProps {
  milestone: RoadmapMilestone
  isLast: boolean
}

export const RoadmapNode: React.FC<RoadmapNodeProps> = ({ milestone, isLast }) => {
  const { isMilestoneCompleted, toggleMilestone, courses, quizzes } = useLearning()
  const completed = isMilestoneCompleted(milestone.id)

  const linkedCourse = courses.find((c) => c.id === milestone.linkedCourseId)
  const linkedQuiz = quizzes.find((q) => q.id === milestone.linkedQuizId)

  return (
    <div className={`roadmap-step ${completed ? 'completed' : ''}`}>
      {/* Node Marker */}
      <div className={`step-marker ${completed ? 'done' : 'active'}`}>
        {completed ? '✓' : milestone.order}
      </div>

      {/* Content */}
      <div className="step-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Phase {milestone.order}
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px' }}>
              {milestone.title}
            </h4>
          </div>

          <button
            onClick={() => toggleMilestone(milestone.id)}
            className={`btn btn-sm ${completed ? 'btn-success' : 'btn-secondary'}`}
            style={{ borderRadius: '20px' }}
          >
            {completed ? '✓ Mastered (+60 XP)' : 'Mark as Mastered'}
          </button>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {milestone.description}
        </p>

        {/* Skill tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {milestone.skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-secondary)'
              }}
            >
              • {skill}
            </span>
          ))}
        </div>

        {/* Linked Resources on Platform */}
        {(linkedCourse || linkedQuiz) && (
          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '12px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
              fontSize: '13px'
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Recommended Practice:</span>
            {linkedCourse && (
              <Link
                href={`/courses/${linkedCourse.id}`}
                style={{
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>📚</span> {linkedCourse.title}
              </Link>
            )}
            {linkedQuiz && (
              <Link
                href={`/quiz/${linkedQuiz.id}`}
                style={{
                  color: 'var(--accent-cyan)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>⚡</span> Quiz: {linkedQuiz.title}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RoadmapNode
