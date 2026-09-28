export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface LectureResource {
  id: string
  title: string
  url: string
  type: 'code' | 'pdf' | 'link'
}

export interface Lecture {
  id: string
  title: string
  durationMinutes: number
  videoUrl?: string
  summary: string
  notesMarkdown: string
  resources?: LectureResource[]
}

export interface Module {
  id: string
  title: string
  description: string
  lectures: Lecture[]
}

export interface Course {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  instructor: {
    name: string
    role: string
    avatar: string
    bio: string
  }
  category: 'Frontend' | 'Backend' | 'Fullstack' | 'AI & ML' | 'Design'
  level: SkillLevel
  thumbnail: string
  totalDurationHours: number
  rating: number
  enrolledStudentsCount: number
  modules: Module[]
  tags: string[]
  quizId?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  courseId?: string
  topic: string
  level: SkillLevel
  timeLimitMinutes: number
  xpReward: number
  questions: QuizQuestion[]
}

export interface RoadmapMilestone {
  id: string
  title: string
  description: string
  order: number
  skills: string[]
  linkedCourseId?: string
  linkedQuizId?: string
}

export interface SkillRoadmap {
  id: string
  title: string
  description: string
  category: string
  icon: string
  estimatedWeeks: number
  milestones: RoadmapMilestone[]
}

export interface Goal {
  id: string
  title: string
  targetCount: number
  currentCount: number
  unit: string
  period: 'daily' | 'weekly'
  completed: boolean
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

export interface QuizAttempt {
  quizId: string
  score: number
  totalQuestions: number
  passed: boolean
  attemptedAt: string
}

export interface StudentProgress {
  enrolledCourseIds: string[]
  completedLectureIds: string[] // formatted as `${courseId}:${lectureId}`
  quizAttempts: Record<string, QuizAttempt> // quizId -> best attempt
  completedMilestoneIds: string[]
  goals: Goal[]
  xp: number
  streakDays: number
  lastActiveDate: string
  unlockedBadges: string[]
}
