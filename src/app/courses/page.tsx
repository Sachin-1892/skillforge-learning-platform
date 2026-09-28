'use client'

import React, { useState, useMemo } from 'react'
import { useLearning } from '../../context/LearningContext'
import CourseCard from '../../components/CourseCard'

export default function CoursesPage() {
  const { courses } = useLearning()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedLevel, setSelectedLevel] = useState<string>('All')

  const categories = ['All', 'Frontend', 'Backend', 'AI & ML', 'Design']
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory =
        selectedCategory === 'All' || course.category === selectedCategory

      const matchesLevel =
        selectedLevel === 'All' || course.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [courses, searchTerm, selectedCategory, selectedLevel])

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          Explore Courses & Lectures
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Deep-dive video lessons, structured modular curriculums, and practical quizzes.
        </p>
      </div>

      {/* Filters & Search */}
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search courses, skills, or tags (e.g. React, Python, Docker)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '15px',
              outline: 'none'
            }}
          />
        </div>

        {/* Categories and Levels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginRight: '4px' }}>Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginRight: '4px' }}>Level:</span>
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
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
        Showing <strong>{filteredCourses.length}</strong> of {courses.length} courses
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: '48px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span style={{ fontSize: '40px' }}>🔍</span>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>No courses match your criteria</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Try adjusting your search keywords or clearing your active category & difficulty filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('All')
              setSelectedLevel('All')
            }}
            className="btn btn-secondary"
            style={{ marginTop: '8px' }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
