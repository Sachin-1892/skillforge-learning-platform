'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLearning } from '../../../context/LearningContext'
import { Course, SkillLevel } from '../../../types/learning'
import BadgePill from '../../../components/common/BadgePill'

export default function AdminCoursesPage() {
  const { courses, addCourse, deleteCourse } = useLearning()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [category, setCategory] = useState<'Frontend' | 'Backend' | 'Fullstack' | 'AI & ML' | 'Design'>('Frontend')
  const [level, setLevel] = useState<SkillLevel>('Beginner')
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80')
  const [durationHours, setDurationHours] = useState(10)
  const [instructorName, setInstructorName] = useState('Alex Rivera')
  const [instructorRole, setInstructorRole] = useState('Staff Engineer')
  const [instructorAvatar, setInstructorAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80')
  
  // Module & Lecture
  const [moduleTitle, setModuleTitle] = useState('Foundations & Core Setup')
  const [lectureTitle, setLectureTitle] = useState('Getting Started Walkthrough')
  const [lectureMinutes, setLectureMinutes] = useState(15)
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
  const [lectureNotes, setLectureNotes] = useState('### Learning Objectives\n- Understand the core architecture\n- Setup project and test components')

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newCourseData: Omit<Course, 'id'> = {
      title,
      shortDescription,
      fullDescription: fullDescription || shortDescription,
      category,
      level,
      thumbnail,
      totalDurationHours: durationHours,
      rating: 5.0,
      enrolledStudentsCount: 0,
      tags: [category, level, 'SkillForge'],
      instructor: {
        name: instructorName,
        role: instructorRole,
        avatar: instructorAvatar,
        bio: 'Senior technology practitioner and educator.'
      },
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: moduleTitle,
          description: 'Module core concepts and exercises.',
          lectures: [
            {
              id: `lec-${Date.now()}`,
              title: lectureTitle,
              durationMinutes: lectureMinutes,
              videoUrl,
              summary: 'Comprehensive introductory lesson.',
              notesMarkdown: lectureNotes,
              resources: [
                { id: `res-1`, title: 'Lesson Code Snippets', url: '#', type: 'code' }
              ]
            }
          ]
        }
      ]
    }

    addCourse(newCourseData)
    setIsModalOpen(false)

    // Reset Form
    setTitle('')
    setShortDescription('')
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteCourse(id)
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Link href="/admin" style={{ color: 'var(--text-secondary)' }}>Admin Studio</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>Courses</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Course & Curriculum Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Create and edit student courses, configure lecture video streams, and manage syllabus modules.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          + Create New Course
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search by course title, category, or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Courses Management Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Course</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Level</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Curriculum</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Enrolled</th>
              <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((c) => {
              const lectureCount = c.modules.reduce((acc, m) => acc + m.lectures.length, 0)

              return (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        style={{ width: '60px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{c.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instructor: {c.instructor.name}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px 16px' }}>
                    <BadgePill category={c.category} />
                  </td>

                  <td style={{ padding: '16px 16px' }}>
                    <BadgePill level={c.level} />
                  </td>

                  <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                    {c.modules.length} modules • {lectureCount} lectures
                  </td>

                  <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                    👥 {c.enrolledStudentsCount.toLocaleString()}
                  </td>

                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Link
                        href={`/courses/${c.id}`}
                        target="_blank"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        Preview ↗
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="btn btn-sm"
                        style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Create New Course Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="card"
            style={{
              padding: '28px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Create New Course</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 15 Fullstack Masterclass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Short Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Master App Router, Server Actions, and API routes."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Skill Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Est. Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Thumbnail Image URL</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                />
              </div>

              {/* Initial Module & Lecture */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '12px' }}>
                  Initial Module & First Lecture
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Module Name</label>
                    <input
                      type="text"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>First Lecture Name</label>
                    <input
                      type="text"
                      value={lectureTitle}
                      onChange={(e) => setLectureTitle(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Video Stream URL (.mp4 / stream)</label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Lecture Markdown Notes</label>
                  <textarea
                    rows={3}
                    value={lectureNotes}
                    onChange={(e) => setLectureNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publish Course 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
