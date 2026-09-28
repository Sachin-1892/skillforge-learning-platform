'use client'

import React from 'react'
import Link from 'next/link'
import { useLearning } from '../context/LearningContext'
import CourseCard from '../components/CourseCard'
import ProgressBar from '../components/common/ProgressBar'

export default function HomePage() {
  const {
    courses,
    roadmaps,
    progress,
    isLoaded,
    getCourseProgress,
    getRoadmapProgress,
    toggleGoal
  } = useLearning()

  // Find enrolled course for continue learning
  const activeCourse = courses.find((c) =>
    progress.enrolledCourseIds.includes(c.id)
  ) || courses[0]

  const activeProgress = activeCourse
    ? getCourseProgress(activeCourse.id)
    : { completedCount: 0, totalCount: 0, percentage: 0 }

  // First unfinished lecture or first lecture
  const allLectures = activeCourse?.modules.flatMap((m) =>
    m.lectures.map((l) => ({ ...l, courseId: activeCourse.id }))
  ) || []

  const nextLecture =
    allLectures.find(
      (l) => !progress.completedLectureIds.includes(`${l.courseId}:${l.id}`)
    ) || allLectures[0]

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', fontSize: '13px', fontWeight: 600, color: '#818cf8', marginBottom: '20px' }}>
          <span>✨</span> Built for Student Goal Achievement & Career Readiness
        </div>

        <h1>
          Learn by Doing.<br />
          <span style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Follow Guided Roadmaps.
          </span>
        </h1>

        <p>
          Master frontend engineering, artificial intelligence, and scalable backend architecture with hands-on video lectures, interactive knowledge quizzes, and milestone-based skill pathways.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '28px', flexWrap: 'wrap' }}>
          <Link href="/courses" className="btn btn-primary">
            Explore Courses →
          </Link>
          <Link href="/roadmaps" className="btn btn-secondary">
            View Skill Roadmaps 🗺️
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Student Dashboard 🔥
          </Link>
        </div>
      </section>

      {/* Continue Learning & Daily Goals Row */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', margin: '24px 0 48px' }}>
          {/* Continue Learning Card */}
          {activeCourse && nextLecture && (
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--brand-primary)' }}>
                  Continue Learning
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {activeProgress.completedCount} of {activeProgress.totalCount} completed
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                {activeCourse.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Next: <strong style={{ color: 'var(--text-primary)' }}>{nextLecture.title}</strong> ({nextLecture.durationMinutes} mins)
              </p>

              <div style={{ marginBottom: '20px' }}>
                <ProgressBar value={activeProgress.percentage} showLabel height={8} />
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Link
                  href={`/courses/${activeCourse.id}/learn/${nextLecture.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  Resume Lecture ▶
                </Link>
              </div>
            </div>
          )}

          {/* Daily Goals Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--warning)' }}>
                🎯 Target Study Goals
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {progress.goals.filter((g) => g.completed).length} / {progress.goals.length} Finished
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Click to check off completed tasks and earn bonus XP towards your streak!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {progress.goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: goal.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${goal.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    readOnly
                    style={{ cursor: 'pointer', accentColor: '#10b981', width: '16px', height: '16px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: goal.completed ? 'var(--success)' : 'var(--text-primary)', textDecoration: goal.completed ? 'line-through' : 'none' }}>
                      {goal.title}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    +20 XP
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'right' }}>
              <Link href="/dashboard" style={{ fontSize: '13px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                Manage all goals in Dashboard →
              </Link>
            </div>
          </div>
        </section>

      {/* Featured Career Roadmaps */}
      <section style={{ marginBottom: '56px' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Interactive Skill Roadmaps</h2>
            <p className="section-subtitle">
              Follow curated, phase-by-phase learning paths with clear milestones and practice exercises.
            </p>
          </div>
          <Link href="/roadmaps" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-primary)' }}>
            View All Roadmaps →
          </Link>
        </div>

        <div className="grid-3">
          {roadmaps.map((roadmap) => {
            const rProgress = getRoadmapProgress(roadmap.id)
            return (
              <div key={roadmap.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {roadmap.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                  {roadmap.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1 }}>
                  {roadmap.description}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>{rProgress.completed} of {rProgress.total} Milestones Mastered</span>
                    <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{rProgress.percentage}%</span>
                  </div>
                  <ProgressBar value={rProgress.percentage} height={6} color="#06b6d4" />
                </div>

                <Link href={`/roadmaps?id=${roadmap.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                  Open Roadmap Path →
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* Featured Courses */}
      <section style={{ marginBottom: '56px' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Modular Courses</h2>
            <p className="section-subtitle">
              Hands-on video lectures, code walkthroughs, and knowledge quizzes to level up your engineering skills.
            </p>
          </div>
          <Link href="/courses" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-primary)' }}>
            Browse All ({courses.length}) →
          </Link>
        </div>

        <div className="grid-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  )
}
