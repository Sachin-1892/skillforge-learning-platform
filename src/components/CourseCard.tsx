'use client'

import React from 'react'
import Link from 'next/link'
import { Course } from '../types/learning'
import { BadgePill } from './common/BadgePill'
import { ProgressBar } from './common/ProgressBar'
import { useLearning } from '../context/LearningContext'

interface CourseCardProps {
  course: Course
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { isEnrolled, getCourseProgress } = useLearning()
  const enrolled = isEnrolled(course.id)
  const progress = enrolled ? getCourseProgress(course.id) : null

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
        <img
          src={course.thumbnail.includes('unsplash.com') ? `${course.thumbnail}&w=480&q=65&auto=format` : course.thumbnail}
          alt={course.title}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <BadgePill category={course.category} />
          <BadgePill level={course.level} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
          <Link href={`/courses/${course.id}`} style={{ color: 'var(--text-primary)' }}>
            {course.title}
          </Link>
        </h3>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.shortDescription}
        </p>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {course.instructor.name}
          </span>
        </div>

        {/* Progress or Meta */}
        {enrolled && progress ? (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              <span>Course Progress</span>
              <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{progress.percentage}%</span>
            </div>
            <ProgressBar value={progress.percentage} height={6} />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <span>⏱️ {course.totalDurationHours} hrs</span>
            <span>⭐ {course.rating.toFixed(1)}</span>
            <span>👥 {course.enrolledStudentsCount.toLocaleString()}</span>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 'auto' }}>
          <Link
            href={`/courses/${course.id}`}
            className={`btn ${enrolled ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: '100%', textAlign: 'center' }}
          >
            {enrolled ? 'Continue Course →' : 'View Curriculum'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard