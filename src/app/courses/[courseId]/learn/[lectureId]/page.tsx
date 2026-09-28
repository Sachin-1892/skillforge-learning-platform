'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useLearning } from '../../../../../context/LearningContext'
import ProgressBar from '../../../../../components/common/ProgressBar'

export default function LecturePlayerPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const lectureId = params.lectureId as string

  const {
    courses,
    quizzes,
    isLectureCompleted,
    toggleLectureCompletion,
    getCourseProgress,
    enrollCourse,
    isEnrolled
  } = useLearning()

  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'qa'>('notes')

  const course = courses.find((c) => c.id === courseId)

  // Ensure course enrollment
  React.useEffect(() => {
    if (course && !isEnrolled(course.id)) {
      enrollCourse(course.id)
    }
  }, [course, isEnrolled, enrollCourse])

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <h2>Course not found</h2>
        <Link href="/courses" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Courses
        </Link>
      </div>
    )
  }

  // Find all lectures flattened
  const allLectures = course.modules.flatMap((m) =>
    m.lectures.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
  )

  const currentIndex = allLectures.findIndex((l) => l.id === lectureId)
  const currentLecture = allLectures[currentIndex] || allLectures[0]

  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null
  const nextLecture =
    currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null

  const isCompleted = isLectureCompleted(course.id, currentLecture.id)
  const courseProgress = getCourseProgress(course.id)
  const linkedQuiz = quizzes.find((q) => q.id === course.quizId)

  const handleNext = () => {
    if (!isCompleted) {
      toggleLectureCompletion(course.id, currentLecture.id)
    }
    if (nextLecture) {
      router.push(`/courses/${course.id}/learn/${nextLecture.id}`)
    }
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href={`/courses/${course.id}`}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}
          >
            ← Exit Classroom
          </Link>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{course.title}</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Lesson {currentIndex + 1} of {allLectures.length}: {currentLecture.title}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '140px' }}>
            <ProgressBar value={courseProgress.percentage} showLabel height={6} />
          </div>

          <button
            onClick={() => toggleLectureCompletion(course.id, currentLecture.id)}
            className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-primary'}`}
          >
            {isCompleted ? '✓ Completed (+40 XP)' : 'Mark as Complete'}
          </button>
        </div>
      </div>

      {/* Main Grid: Player on Left, Syllabus on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 360px',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Player & Notes */}
        <div>
          {/* Video Player */}
          <div
            className="card"
            style={{
              overflow: 'hidden',
              backgroundColor: '#000',
              borderRadius: '16px',
              marginBottom: '24px'
            }}
          >
            <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
              <video
                key={currentLecture.id}
                controls
                preload="none"
                autoPlay={false}
                poster={course.thumbnail}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#000'
                }}
              >
                {currentLecture.videoUrl && (
                  <source src={currentLecture.videoUrl} type="video/mp4" />
                )}
                Your browser does not support HTML5 video streaming.
              </video>
            </div>

            {/* Video Controls Bar */}
            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(30, 41, 59, 0.95)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  ⏱️ {currentLecture.durationMinutes} mins
                </span>
                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)' }}>
                  1080p HD
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {prevLecture && (
                  <Link
                    href={`/courses/${course.id}/learn/${prevLecture.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    ← Previous
                  </Link>
                )}

                {nextLecture ? (
                  <button onClick={handleNext} className="btn btn-primary btn-sm">
                    Complete & Next →
                  </button>
                ) : (
                  linkedQuiz && (
                    <Link href={`/quiz/${linkedQuiz.id}`} className="btn btn-primary btn-sm">
                      Take Course Quiz ⚡
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Lecture Tabs: Notes / Resources / Q&A */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '20px' }}>
              <button
                onClick={() => setActiveTab('notes')}
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: activeTab === 'notes' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'notes' ? '2px solid var(--brand-primary)' : 'none',
                  paddingBottom: '8px'
                }}
              >
                📝 Lecture Notes & Concepts
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: activeTab === 'resources' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'resources' ? '2px solid var(--brand-primary)' : 'none',
                  paddingBottom: '8px'
                }}
              >
                📎 Downloadable Resources ({currentLecture.resources?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('qa')}
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: activeTab === 'qa' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'qa' ? '2px solid var(--brand-primary)' : 'none',
                  paddingBottom: '8px'
                }}
              >
                💬 Community Discussion
              </button>
            </div>

            {/* Tab 1: Notes */}
            {activeTab === 'notes' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
                  {currentLecture.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '20px' }}>
                  {currentLecture.summary}
                </p>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    fontFamily: 'inherit',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {currentLecture.notesMarkdown}
                </div>
              </div>
            )}

            {/* Tab 2: Resources */}
            {activeTab === 'resources' && (
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                  Companion Materials
                </h4>
                {currentLecture.resources && currentLecture.resources.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {currentLecture.resources.map((res) => (
                      <div
                        key={res.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>{res.type === 'code' ? '💻' : res.type === 'pdf' ? '📄' : '🔗'}</span>
                          <span style={{ fontSize: '14px', fontWeight: 500 }}>{res.title}</span>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    No extra downloads required for this lecture. Follow along in your IDE!
                  </p>
                )}
              </div>
            )}

            {/* Tab 3: Q&A */}
            {activeTab === 'qa' && (
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  Student Discussion Forum
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Ask questions, share project links, or discuss concepts with mentors and peers.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="Ask a question about this lecture..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                  <button className="btn btn-primary btn-sm">Post</button>
                </div>

                <div
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: '#818cf8' }}>Mentor Sarah</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>2 hours ago</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Make sure to test the code snippets in your local development environment to observe the type checking behavior firsthand!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Curriculum Syllabus Drawer */}
        <div
          className="card"
          style={{
            padding: '20px',
            position: 'sticky',
            top: '84px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto'
          }}
        >
          <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Curriculum Playlist</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {courseProgress.completedCount} of {courseProgress.totalCount} completed ({courseProgress.percentage}%)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {course.modules.map((mod, mIdx) => (
              <div key={mod.id}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '8px' }}>
                  Module {mIdx + 1}: {mod.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {mod.lectures.map((lec) => {
                    const isSelected = lec.id === currentLecture.id
                    const completed = isLectureCompleted(course.id, lec.id)

                    return (
                      <Link
                        key={lec.id}
                        href={`/courses/${course.id}/learn/${lec.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: isSelected
                            ? 'rgba(99, 102, 241, 0.2)'
                            : completed
                            ? 'rgba(16, 185, 129, 0.05)'
                            : 'transparent',
                          border: isSelected
                            ? '1px solid var(--brand-primary)'
                            : '1px solid transparent',
                          fontSize: '13px',
                          color: isSelected ? '#fff' : 'var(--text-secondary)'
                        }}
                      >
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: completed ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          {completed ? '✓' : '▶'}
                        </span>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lec.title}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {lec.durationMinutes}m
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Quiz Link in Sidebar */}
            {linkedQuiz && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <Link
                  href={`/quiz/${linkedQuiz.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', textAlign: 'center', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                >
                  ⚡ Take Final Course Quiz
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
