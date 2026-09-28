import React from 'react'

interface ProgressBarProps {
  value: number // 0 to 100
  showLabel?: boolean
  height?: number
  color?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  height = 8,
  color = '#6366f1' // modern indigo
}) => {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'rgba(0,0,0,0.06)',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '999px',
            transition: 'width 0.4s ease-out'
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginTop: '4px',
            color: '#6b7280',
            fontWeight: 500
          }}
        >
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar
