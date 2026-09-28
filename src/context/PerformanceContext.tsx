'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type PerformanceMode = 'auto' | 'lite' | 'high'

interface PerformanceContextType {
  mode: PerformanceMode
  effectiveMode: 'lite' | 'high'
  isLowEndDetected: boolean
  deviceInfo: {
    cores?: number
    memoryGb?: number
    saveData?: boolean
    networkType?: string
  }
  setMode: (mode: PerformanceMode) => void
}

const STORAGE_KEY = 'skillforge_perf_mode_v1'

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<PerformanceMode>('auto')
  const [isLowEndDetected, setIsLowEndDetected] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<{
    cores?: number
    memoryGb?: number
    saveData?: boolean
    networkType?: string
  }>({})

  // Detect device specs on client mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY) as PerformanceMode | null
      if (savedMode && ['auto', 'lite', 'high'].includes(savedMode)) {
        setModeState(savedMode)
      }
    } catch {
      // ignore
    }

    if (typeof window === 'undefined') return

    const nav = window.navigator as unknown as {
      hardwareConcurrency?: number
      deviceMemory?: number
      connection?: {
        saveData?: boolean
        effectiveType?: string
      }
    }

    const cores = nav.hardwareConcurrency || 4
    const memoryGb = nav.deviceMemory || 4
    const connection = nav.connection
    const saveData = connection?.saveData || false
    const networkType = connection?.effectiveType || '4g'

    setDeviceInfo({
      cores,
      memoryGb,
      saveData,
      networkType
    })

    // Low-end device criteria:
    // 1. RAM <= 3GB
    // 2. Cores <= 4 with low memory
    // 3. User has "Data Saver" enabled in Chrome/Android
    // 4. Slow network (2g or slow-2g or 3g)
    const isBudgetDevice = memoryGb <= 3 || (cores <= 4 && memoryGb <= 4)
    const isSlowConnection = saveData || networkType === '2g' || networkType === '3g'

    setIsLowEndDetected(isBudgetDevice || isSlowConnection)
  }, [])

  const setMode = (newMode: PerformanceMode) => {
    setModeState(newMode)
    try {
      localStorage.setItem(STORAGE_KEY, newMode)
    } catch {
      // ignore
    }
  }

  // Calculate actual effective mode applied to DOM
  const effectiveMode: 'lite' | 'high' =
    mode === 'auto' ? (isLowEndDetected ? 'lite' : 'high') : mode

  // Apply data-performance attribute to <html> element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-performance', effectiveMode)
    }
  }, [effectiveMode])

  return (
    <PerformanceContext.Provider
      value={{
        mode,
        effectiveMode,
        isLowEndDetected,
        deviceInfo,
        setMode
      }}
    >
      {children}
    </PerformanceContext.Provider>
  )
}

export const usePerformance = () => {
  const context = useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider')
  }
  return context
}
