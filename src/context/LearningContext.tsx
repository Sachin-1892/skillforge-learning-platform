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

export type UserRole = 'student' | 'admin'

interface LearningContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  courses: Course[]
  quizzes: Quiz[]
  roadmaps: SkillRoadmap[]
  badges: Badge[]
  progress: StudentProgress
  isLoaded: boolean
  // Student Actions
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
  // Admin Actions (CRUD)
  addCourse: (courseData: Omit<Course, 'id'>) => string
  updateCourse: (courseId: string, updated: Partial<Course>) => void
  deleteCourse: (courseId: string) => void
  addQuiz: (quizData: Omit<Quiz, 'id'>) => string
  deleteQuiz: (quizId: string) => void
  addRoadmap: (roadmapData: Omit<SkillRoadmap, 'id'>) => string
  deleteRoadmap: (roadmapId: string) => void
}

const STORAGE_KEY_PROGRESS = 'skillforge_student_progress_v1'
const STORAGE_KEY_COURSES = 'skillforge_courses_v1'
const STORAGE_KEY_QUIZZES = 'skillforge_quizzes_v1'
const STORAGE_KEY_ROADMAPS = 'skillforge_roadmaps_v1'
const STORAGE_KEY_ROLE = 'skillforge_user_role_v1'

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
  const [role, setRoleState] = useState<UserRole>('student')
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES)
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES)
  const [roadmaps, setRoadmaps] = useState<SkillRoadmap[]>(INITIAL_ROADMAPS)
  const [badges] = useState<Badge[]>(INITIAL_BADGES)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState<StudentProgress>(DEFAULT_PROGRESS)

  // Hydrate from localStorage once mounted
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole | null
      if (savedRole && (savedRole === 'student' || savedRole === 'admin')) {
        setRoleState(savedRole)
      }

      const savedCourses = localStorage.getItem(STORAGE_KEY_COURSES)
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses))
      }

      const savedQuizzes = localStorage.getItem(STORAGE_KEY_QUIZZES)
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes))
      }

      const savedRoadmaps = localStorage.getItem(STORAGE_KEY_ROADMAPS)
      if (savedRoadmaps) {
        setRoadmaps(JSON.parse(savedRoadmaps))
      }

      const savedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS)
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress))
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
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress))
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses))
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes))
      localStorage.setItem(STORAGE_KEY_ROADMAPS, JSON.stringify(roadmaps))
      localStorage.setItem(STORAGE_KEY_ROLE, role)
    } catch (e) {
      console.error('Failed to sync state to localStorage', e)
    }
  }, [progress, courses, quizzes, roadmaps, role, isLoaded])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, newRole)
    } catch {
      // ignore
    }
  }

  // --- Student Actions ---
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
    setCourses(INITIAL_COURSES)
    setQuizzes(INITIAL_QUIZZES)
    setRoadmaps(INITIAL_ROADMAPS)
    try {
      localStorage.removeItem(STORAGE_KEY_PROGRESS)
      localStorage.removeItem(STORAGE_KEY_COURSES)
      localStorage.removeItem(STORAGE_KEY_QUIZZES)
      localStorage.removeItem(STORAGE_KEY_ROADMAPS)
    } catch {
      // ignore
    }
  }

  // --- Admin CRUD Actions ---
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const id = `course-${Date.now()}`
    const newCourse: Course = { ...courseData, id }
    setCourses((prev) => [newCourse, ...prev])
    return id
  }

  const updateCourse = (courseId: string, updated: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, ...updated } : c))
    )
  }

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId))
  }

  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const id = `quiz-${Date.now()}`
    const newQuiz: Quiz = { ...quizData, id }
    setQuizzes((prev) => [newQuiz, ...prev])
    return id
  }

  const deleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId))
  }

  const addRoadmap = (roadmapData: Omit<SkillRoadmap, 'id'>) => {
    const id = `roadmap-${Date.now()}`
    const newRoadmap: SkillRoadmap = { ...roadmapData, id }
    setRoadmaps((prev) => [...prev, newRoadmap])
    return id
  }

  const deleteRoadmap = (roadmapId: string) => {
    setRoadmaps((prev) => prev.filter((r) => r.id !== roadmapId))
  }

  return (
    <LearningContext.Provider
      value={{
        role,
        setRole,
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
        resetProgress,
        addCourse,
        updateCourse,
        deleteCourse,
        addQuiz,
        deleteQuiz,
        addRoadmap,
        deleteRoadmap
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
