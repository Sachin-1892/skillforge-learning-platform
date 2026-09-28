'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLearning } from '../../context/LearningContext'
import RoadmapNode from '../../components/roadmap/RoadmapNode'
import ProgressBar from '../../components/common/ProgressBar'

function RoadmapsContent() {
  const { roadmaps, getRoadmapProgress } = useLearning()
  const searchParams = useSearchParams()
  const initialRoadmapId = searchParams.get('id') || roadmaps[0]?.id

  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(initialRoadmapId)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id && roadmaps.some((r) => r.id === id)) {
      setSelectedRoadmapId(id)
    }
  }, [searchParams, roadmaps])

  const currentRoadmap =
    roadmaps.find((r) => r.id === selectedRoadmapId) || roadmaps[0]

  const roadmapProgress = currentRoadmap
    ? getRoadmapProgress(currentRoadmap.id)
    : { completed: 0, total: 0, percentage: 0 }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
          <span>🗺️</span> Skill Pathways & Career Roadmaps
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          Interactive Career & Tech Roadmaps
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '750px' }}>
          Follow step-by-step pathways to achieve your learning goals. Each milestone includes required skills, conceptual foundations, and direct links to courses and quizzes.
        </p>
      </div>

      {/* Roadmap Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '28px'
        }}
      >
        {roadmaps.map((r) => {
          const isSelected = r.id === currentRoadmap.id
          const prog = getRoadmapProgress(r.id)

          return (
            <button
              key={r.id}
              onClick={() => setSelectedRoadmapId(r.id)}
              className="card"
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '240px',
                textAlign: 'left',
                border: isSelected
                  ? '2px solid var(--brand-primary)'
                  : '1px solid var(--border-color)',
                background: isSelected
                  ? 'rgba(99, 102, 241, 0.15)'
                  : 'var(--bg-card)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '24px' }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                  {r.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {prog.completed}/{prog.total} Mastered ({prog.percentage}%)
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Roadmap Overview Banner */}
      {currentRoadmap && (
        <div
          className="card"
          style={{
            padding: '28px',
            marginBottom: '36px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '24px' }}>{currentRoadmap.icon}</span>
                <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 600 }}>
                  {currentRoadmap.category}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ⏳ Approx. {currentRoadmap.estimatedWeeks} Weeks
                </span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{currentRoadmap.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px', maxWidth: '650px' }}>
                {currentRoadmap.description}
              </p>
            </div>

            {/* Progress Gauge */}
            <div style={{ minWidth: '220px', background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                <span>Roadmap Mastery</span>
                <span style={{ color: 'var(--brand-primary)' }}>{roadmapProgress.percentage}%</span>
              </div>
              <ProgressBar value={roadmapProgress.percentage} height={8} />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                {roadmapProgress.completed} of {roadmapProgress.total} phases completed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Milestone Pathway Flow */}
      {currentRoadmap && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            Phase-by-Phase Pathway
          </h3>

          <div className="roadmap-path">
            {currentRoadmap.milestones.map((milestone, idx) => (
              <RoadmapNode
                key={milestone.id}
                milestone={milestone}
                isLast={idx === currentRoadmap.milestones.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RoadmapsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '64px 0', textAlign: 'center' }}>Loading roadmap pathway...</div>}>
      <RoadmapsContent />
    </Suspense>
  )
}
