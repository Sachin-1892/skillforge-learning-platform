import React from 'react'
import { SkillLevel } from '../../types/learning'

interface BadgePillProps {
  level?: SkillLevel
  category?: string
  status?: string
}

export const BadgePill: React.FC<BadgePillProps> = ({ level, category, status }) => {
  if (level) {
    const classMap: Record<SkillLevel, string> = {
      Beginner: 'badge-beginner',
      Intermediate: 'badge-intermediate',
      Advanced: 'badge-advanced'
    }
    return <span className={`badge ${classMap[level]}`}>{level}</span>
  }

  if (category) {
    return (
      <span
        className="badge"
        style={{
          background: 'rgba(99, 102, 241, 0.12)',
          color: '#818cf8',
          border: '1px solid rgba(99, 102, 241, 0.25)'
        }}
      >
        {category}
      </span>
    )
  }

  if (status) {
    return (
      <span
        className="badge"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#f8fafc',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {status}
      </span>
    )
  }

  return null
}

export default BadgePill
