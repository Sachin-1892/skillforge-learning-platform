'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Course,
  Quiz,
  SkillRoadmap,
  Goal,
  Badge,
  QuizAttempt,
  StudentProgress
} from '../types/learning'
import {
  INITIAL_COURSES,
  INITIAL_QUIZZES,
  INITIAL_ROADMAPS,
  INITIAL_BADGES,
  INITIAL_GOALS
} from '../data/mockData'

interface LearningContextType {
  courses: Course[]
  quizzes: Quiz[]
  roadmaps: SkillRoadmap[]
  badges: Badge[]
  progress: StudentProgress
  isLoaded: boolean
  enrollCourse: (courseId: string) => void
  isEnrolled: (courseId: string) => boolean
  toggleLectureCompletion: (courseId: string, lectureId: string) => void
  isLectureCompleted: (courseId: string, lectureId: string) => boolean
  getCourseProgress: (courseId: string) => {
    completedCount: number
    totalCount: number
    percentage: number
  }
  submitQuizResult: (quizId: string, score: number, totalQuestions: number) => {
    passed: boolean
    xpGained: number
    newBadgeUnlocked: boolean
  }
  toggleMilestone: (milestoneId: string) => void
  isMilestoneCompleted: (milestoneId: string) => boolean
  getRoadmapProgress: (roadmapId: string) => {
    completed: number
    total: number
    percentage: number
  }
  toggleGoal: (goalId: string) => void
  addCustomGoal: (
    title: string,
    targetCount: number,
    unit: string,
    period: 'daily' | 'weekly'
  ) => void
  resetProgress: () => void
}

const STORAGE_KEY = 'skillforge_student_progress_v1'

const DEFAULT_PROGRESS: StudentProgress = {
  enrolledCourseIds: ['frontend-mastery'],
  completedLectureIds: ['frontend-mastery:lec-1-1'],
  quizAttempts: {},
  completedMilestoneIds: ['ms-fe-1'],
  goals: INITIAL_GOALS,
  xp: 450,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedBadges: ['badge-first-step', 'badge-knowledge-seeker', 'badge-streak-fire']
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [courses] = useState<Course[]>(INITIAL_COURSES)
  const [quizzes] = useState<Quiz[]>(INITIAL_QUIZZES)
  const [roadmaps] = useState<SkillRoadmap[]>(INITIAL_ROADMAPS)
  const [badges] = useState<Badge[]>(INITIAL_BADGES)
  const [isLoaded, setIsLoaded] = useState(false)

  const [progress, setProgress] = useState<StudentProgress>(DEFAULT_PROGRESS)

  // Hydrate from localStorage once mounted on client to prevent Next.js hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setProgress(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
    setIsLoaded(true)
  }, [])

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch (e) {
      console.error('Failed to save progress to localStorage', e)
    }
  }, [progress, isLoaded])

  const enrollCourse = (courseId: string) => {
    setProgress((prev) => {
      if (prev.enrolledCourseIds.includes(courseId)) return prev
      const newBadges = [...prev.unlockedBadges]
      if (!newBadges.includes('badge-first-step')) {
        newBadges.push('badge-first-step')
      }
      return {
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
        xp: prev.xp + 50,
        unlockedBadges: newBadges
      }
    })
  }

  const isEnrolled = (courseId: string) => {
    return progress.enrolledCourseIds.includes(courseId)
  }

  const toggleLectureCompletion = (courseId: string, lectureId: string) => {
    const key = `${courseId}:${lectureId}`
    setProgress((prev) => {
      const alreadyCompleted = prev.completedLectureIds.includes(key)
      let nextCompleted: string[]
      let xpChange = 0
      const newBadges = [...prev.unlockedBadges]

      if (alreadyCompleted) {
        nextCompleted = prev.completedLectureIds.filter((id) => id !== key)
        xpChange = -25
      } else {
        nextCompleted = [...prev.completedLectureIds, key]
        xpChange = 40
        if (!newBadges.includes('badge-knowledge-seeker')) {
          newBadges.push('badge-knowledge-seeker')
        }
      }

      // Update daily goal if completed
      const updatedGoals = prev.goals.map((g) => {
        if (g.id === 'goal-lectures') {
          const nextCount = Math.max(0, g.currentCount + (alreadyCompleted ? -1 : 1))
          return {
            ...g,
            currentCount: nextCount,
            completed: nextCount >= g.targetCount
          }
        }
        return g
      })

      return {
        ...prev,
        completedLectureIds: nextCompleted,
        xp: Math.max(0, prev.xp + xpChange),
        unlockedBadges: newBadges,
        goals: updatedGoals
      }
    })
  }

  const isLectureCompleted = (courseId: string, lectureId: string) => {
    return progress.completedLectureIds.includes(`${courseId}:${lectureId}`)
  }

  const getCourseProgress = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return { completedCount: 0, totalCount: 0, percentage: 0 }

    const allLectureIds = course.modules.flatMap((m) =>
      m.lectures.map((l) => `${course.id}:${l.id}`)
    )
    const totalCount = allLectureIds.length
    if (totalCount === 0) return { completedCount: 0, totalCount: 0, percentage: 0 }

    const completedCount = allLectureIds.filter((id) =>
      progress.completedLectureIds.includes(id)
    ).length
    const percentage = Math.round((completedCount / totalCount) * 100)

    return { completedCount, totalCount, percentage }
  }

  const submitQuizResult = (
    quizId: string,
    score: number,
    totalQuestions: number
  ) => {
    const percentage = Math.round((score / totalQuestions) * 100)
    const passed = percentage >= 60
    const quiz = quizzes.find((q) => q.id === quizId)
    const baseReward = quiz?.xpReward || 100
    const xpGained = passed ? Math.round((baseReward * score) / totalQuestions) : 25

    let unlockedChamp = false

    setProgress((prev) => {
      const newBadges = [...prev.unlockedBadges]
      if (score === totalQuestions && !newBadges.includes('badge-quiz-champ')) {
        newBadges.push('badge-quiz-champ')
        unlockedChamp = true
      }

      const attempt: QuizAttempt = {
        quizId,
        score,
        totalQuestions,
        passed,
        attemptedAt: new Date().toISOString()
      }

      const updatedAttempts = {
        ...prev.quizAttempts,
        [quizId]: attempt
      }

      const updatedGoals = prev.goals.map((g) => {
        if (g.id === 'goal-quiz' && passed) {
          return {
            ...g,
            currentCount: Math.min(g.targetCount, g.currentCount + 1),
            completed: true
          }
        }
        return g
      })

      return {
        ...prev,
        quizAttempts: updatedAttempts,
        xp: prev.xp + xpGained,
        unlockedBadges: newBadges,
        goals: updatedGoals
      }
    })

    return { passed, xpGained, newBadgeUnlocked: unlockedChamp }
  }

  const toggleMilestone = (milestoneId: string) => {
    setProgress((prev) => {
      const exists = prev.completedMilestoneIds.includes(milestoneId)
      const nextMilestones = exists
        ? prev.completedMilestoneIds.filter((id) => id !== milestoneId)
        : [...prev.completedMilestoneIds, milestoneId]

      const newBadges = [...prev.unlockedBadges]
      if (!exists && !newBadges.includes('badge-roadmap-pioneer')) {
        newBadges.push('badge-roadmap-pioneer')
      }

      return {
        ...prev,
        completedMilestoneIds: nextMilestones,
        xp: prev.xp + (exists ? -30 : 60),
        unlockedBadges: newBadges
      }
    })
  }

  const isMilestoneCompleted = (milestoneId: string) => {
    return progress.completedMilestoneIds.includes(milestoneId)
  }

  const getRoadmapProgress = (roadmapId: string) => {
    const roadmap = roadmaps.find((r) => r.id === roadmapId)
    if (!roadmap || roadmap.milestones.length === 0) {
      return { completed: 0, total: 0, percentage: 0 }
    }
    const total = roadmap.milestones.length
    const completed = roadmap.milestones.filter((m) =>
      progress.completedMilestoneIds.includes(m.id)
    ).length
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    }
  }

  const toggleGoal = (goalId: string) => {
    setProgress((prev) => {
      const updatedGoals = prev.goals.map((g) => {
        if (g.id === goalId) {
          const nextCompleted = !g.completed
          return {
            ...g,
            completed: nextCompleted,
            currentCount: nextCompleted ? g.targetCount : 0
          }
        }
        return g
      })
      return {
        ...prev,
        goals: updatedGoals,
        xp: prev.xp + 20
      }
    })
  }

  const addCustomGoal = (
    title: string,
    targetCount: number,
    unit: string,
    period: 'daily' | 'weekly'
  ) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      targetCount,
      currentCount: 0,
      unit,
      period,
      completed: false
    }
    setProgress((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }))
  }

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <LearningContext.Provider
      value={{
        courses,
        quizzes,
        roadmaps,
        badges,
        progress,
        isLoaded,
        enrollCourse,
        isEnrolled,
        toggleLectureCompletion,
        isLectureCompleted,
        getCourseProgress,
        submitQuizResult,
        toggleMilestone,
        isMilestoneCompleted,
        getRoadmapProgress,
        toggleGoal,
        addCustomGoal,
        resetProgress
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

export const useLearning = () => {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}
