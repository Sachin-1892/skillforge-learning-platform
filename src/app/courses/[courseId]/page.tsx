'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLearning } from '../../../context/LearningContext'
import BadgePill from '../../../components/common/BadgePill'
import ProgressBar from '../../../components/common/ProgressBar'

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string

  const {
    courses,
    quizzes,
    isEnrolled,
    enrollCourse,
    getCourseProgress,
    isLectureCompleted
  } = useLearning()

  const course = courses.find((c) => c.id === courseId)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-ai-1': true,
    'mod-be-1': true,
    'mod-ui-1': true
  })

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <h2>Course not found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>
          The requested course could not be located.
        </p>
        <Link href="/courses" className="btn btn-primary">
          Back to Courses
        </Link>
      </div>
    )
  }

  const enrolled = isEnrolled(course.id)
  const progress = getCourseProgress(course.id)
  const linkedQuiz = quizzes.find((q) => q.id === course.quizId)

  // Find first lecture
  const firstLecture = course.modules[0]?.lectures[0]

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId]
    }))
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <Link href="/courses" style={{ color: 'var(--text-secondary)' }}>Courses</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{course.title}</span>
      </div>

      {/* Hero Header */}
      <div
        className="card"
        style={{
          padding: '36px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <BadgePill category={course.category} />
            <BadgePill level={course.level} />
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
            {course.title}
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {course.fullDescription}
          </p>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
            <span>⏱️ <strong>{course.totalDurationHours} hrs</strong> total</span>
            <span>📹 <strong>{course.modules.reduce((acc, m) => acc + m.lectures.length, 0)}</strong> lectures</span>
            <span>⭐ <strong>{course.rating.toFixed(2)}</strong> student rating</span>
            <span>👥 <strong>{course.enrolledStudentsCount.toLocaleString()}</strong> enrolled</span>
          </div>

          {/* Action Button & Enrollment */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            {enrolled ? (
              <>
                {firstLecture && (
                  <Link
                    href={`/courses/${course.id}/learn/${firstLecture.id}`}
                    className="btn btn-primary"
                    style={{ padding: '12px 28px', fontSize: '15px' }}
                  >
                    Continue to Classroom ▶
                  </Link>
                )}
                <span style={{ fontSize: '14px', color: 'var(--success)', fontWeight: 600 }}>
                  ✓ Enrolled ({progress.percentage}% completed)
                </span>
              </>
            ) : (
              <button
                onClick={() => enrollCourse(course.id)}
                className="btn btn-primary"
                style={{ padding: '12px 28px', fontSize: '15px' }}
              >
                Enroll in Course for Free 🚀
              </button>
            )}

            {linkedQuiz && (
              <Link
                href={`/quiz/${linkedQuiz.id}`}
                className="btn btn-secondary"
                style={{ padding: '12px 20px', fontSize: '14px' }}
              >
                Take Course Quiz ⚡
              </Link>
            )}
          </div>
        </div>

        {/* Thumbnail Preview & Instructor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '240px' }}>
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>{course.instructor.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--brand-primary)', marginBottom: '4px' }}>
                {course.instructor.role}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {course.instructor.bio}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Curriculum & Syllabus */}
      <div style={{ margin: '40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Curriculum & Syllabus</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Step-by-step modular lessons with interactive notes and code examples.
            </p>
          </div>
          {enrolled && (
            <div style={{ width: '220px' }}>
              <ProgressBar value={progress.percentage} showLabel height={8} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {course.modules.map((module, mIdx) => {
            const isExpanded = expandedModules[module.id] ?? true
            const moduleCompleted = module.lectures.every((l) =>
              isLectureCompleted(course.id, l.id)
            )

            return (
              <div
                key={module.id}
                className="card"
                style={{ overflow: 'hidden' }}
              >
                {/* Module Header */}
                <div
                  onClick={() => toggleModule(module.id)}
                  style={{
                    padding: '18px 24px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                      Module {mIdx + 1}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginTop: '2px' }}>
                      {module.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {module.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {moduleCompleted && (
                      <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
                        ✓ Completed
                      </span>
                    )}
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      {module.lectures.length} lessons {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Lectures List */}
                {isExpanded && (
                  <div style={{ padding: '8px 16px' }}>
                    {module.lectures.map((lecture, lIdx) => {
                      const completed = isLectureCompleted(course.id, lecture.id)
                      return (
                        <div
                          key={lecture.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            margin: '4px 0',
                            borderRadius: '10px',
                            background: completed ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <span
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                                color: completed ? 'var(--success)' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700
                              }}
                            >
                              {completed ? '✓' : `${mIdx + 1}.${lIdx + 1}`}
                            </span>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                                {lecture.title}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {lecture.durationMinutes} minutes • {lecture.summary}
                              </div>
                            </div>
                          </div>

                          <Link
                            href={`/courses/${course.id}/learn/${lecture.id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            {completed ? 'Review' : 'Play ▶'}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
