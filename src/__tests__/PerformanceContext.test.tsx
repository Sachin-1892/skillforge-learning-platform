import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { PerformanceProvider, usePerformance } from '../context/PerformanceContext'

const PerfTestConsumer: React.FC = () => {
  const { mode, effectiveMode, setMode } = usePerformance()

  return (
    <div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="effective">{effectiveMode}</div>

      <button data-testid="set-lite" onClick={() => setMode('lite')}>
        Set Lite
      </button>
      <button data-testid="set-high" onClick={() => setMode('high')}>
        Set High
      </button>
      <button data-testid="set-auto" onClick={() => setMode('auto')}>
        Set Auto
      </button>
    </div>
  )
}

describe('PerformanceContext Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes in auto mode by default', () => {
    render(
      <PerformanceProvider>
        <PerfTestConsumer />
      </PerformanceProvider>
    )

    expect(screen.getByTestId('mode').textContent).toBe('auto')
    expect(['lite', 'high']).toContain(screen.getByTestId('effective').textContent)
  })

  it('switches to lite mode and updates data-performance attribute on root', async () => {
    render(
      <PerformanceProvider>
        <PerfTestConsumer />
      </PerformanceProvider>
    )

    const liteBtn = screen.getByTestId('set-lite')
    await act(async () => {
      liteBtn.click()
    })

    expect(screen.getByTestId('mode').textContent).toBe('lite')
    expect(screen.getByTestId('effective').textContent).toBe('lite')
    expect(document.documentElement.getAttribute('data-performance')).toBe('lite')
  })

  it('switches to high quality mode and updates data-performance attribute on root', async () => {
    render(
      <PerformanceProvider>
        <PerfTestConsumer />
      </PerformanceProvider>
    )

    const highBtn = screen.getByTestId('set-high')
    await act(async () => {
      highBtn.click()
    })

    expect(screen.getByTestId('mode').textContent).toBe('high')
    expect(screen.getByTestId('effective').textContent).toBe('high')
    expect(document.documentElement.getAttribute('data-performance')).toBe('high')
  })
})
