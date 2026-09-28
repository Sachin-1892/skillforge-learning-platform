'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLearning } from '../../../context/LearningContext'
import { SkillRoadmap, RoadmapMilestone } from '../../../types/learning'

export default function AdminRoadmapsPage() {
  const { roadmaps, addRoadmap, deleteRoadmap } = useLearning()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Engineering')
  const [icon, setIcon] = useState('🚀')
  const [estimatedWeeks, setEstimatedWeeks] = useState(12)

  // Milestone State
  const [ms1Title, setMs1Title] = useState('Core Fundamentals & Setup')
  const [ms1Desc, setMs1Desc] = useState('Master the basics, tools, and developer environment.')
  const [ms1Skills, setMs1Skills] = useState('Architecture, Tools, Syntax, Best Practices')

  const handleCreateRoadmap = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const skillsArray = ms1Skills.split(',').map((s) => s.trim()).filter(Boolean)

    const newRoadmap: Omit<SkillRoadmap, 'id'> = {
      title,
      description,
      category,
      icon,
      estimatedWeeks,
      milestones: [
        {
          id: `ms-${Date.now()}-1`,
          order: 1,
          title: ms1Title,
          description: ms1Desc,
          skills: skillsArray
        }
      ]
    }

    addRoadmap(newRoadmap)
    setIsModalOpen(false)
    setTitle('')
    setDescription('')
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete roadmap "${name}"?`)) {
      deleteRoadmap(id)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Link href="/admin" style={{ color: 'var(--text-secondary)' }}>Admin Studio</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>Roadmaps</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Career Roadmap Studio</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Design phase-by-phase learning journeys, set required skill milestones, and connect platform courses.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          + Build New Roadmap
        </button>
      </div>

      {/* Roadmaps Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Roadmap</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Duration</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Milestone Phases</th>
              <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roadmaps.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '380px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {r.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                  {r.category}
                </td>

                <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                  ⏳ {r.estimatedWeeks} Weeks
                </td>

                <td style={{ padding: '16px 16px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {r.milestones.length} Phases
                </td>

                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <Link
                      href={`/roadmaps?id=${r.id}`}
                      target="_blank"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      View Pathway ↗
                    </Link>
                    <button
                      onClick={() => handleDelete(r.id, r.title)}
                      className="btn btn-sm"
                      style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Roadmap Modal */}
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
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Build New Career Roadmap</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoadmap} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Roadmap Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud & DevOps Architect Pathway"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Summary Description</label>
                <input
                  type="text"
                  placeholder="e.g. From Linux & Docker to Kubernetes and Cloud Security."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Icon Emoji</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px', textAlign: 'center' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Est. Weeks</label>
                  <input
                    type="number"
                    min="2"
                    value={estimatedWeeks}
                    onChange={(e) => setEstimatedWeeks(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Initial Phase Milestone */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '12px' }}>
                  Phase 1 Milestone
                </h4>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phase Title</label>
                  <input
                    type="text"
                    value={ms1Title}
                    onChange={(e) => setMs1Title(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '13px' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phase Description</label>
                  <input
                    type="text"
                    value={ms1Desc}
                    onChange={(e) => setMs1Desc(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={ms1Skills}
                    onChange={(e) => setMs1Skills(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Roadmap 🗺️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
