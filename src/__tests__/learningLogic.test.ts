import { describe, it, expect } from 'vitest'
import { INITIAL_COURSES, INITIAL_QUIZZES, INITIAL_ROADMAPS, INITIAL_GOALS, INITIAL_BADGES } from '../data/mockData'

describe('Data Integrity Checks', () => {
  it('should have valid courses with modules and lectures', () => {
    expect(INITIAL_COURSES.length).toBeGreaterThan(0)
    for (const course of INITIAL_COURSES) {
      expect(course.id).toBeDefined()
      expect(course.title).toBeTruthy()
      expect(course.modules.length).toBeGreaterThan(0)
      for (const module of course.modules) {
        expect(module.lectures.length).toBeGreaterThan(0)
        for (const lecture of module.lectures) {
          expect(lecture.id).toBeTruthy()
          expect(lecture.title).toBeTruthy()
          expect(lecture.durationMinutes).toBeGreaterThan(0)
        }
      }
    }
  })

  it('should have valid quizzes with questions and correct answers in range', () => {
    expect(INITIAL_QUIZZES.length).toBeGreaterThan(0)
    for (const quiz of INITIAL_QUIZZES) {
      expect(quiz.id).toBeDefined()
      expect(quiz.questions.length).toBeGreaterThan(0)
      expect(quiz.xpReward).toBeGreaterThan(0)
      for (const question of quiz.questions) {
        expect(question.options.length).toBeGreaterThanOrEqual(2)
        expect(question.correctAnswerIndex).toBeGreaterThanOrEqual(0)
        expect(question.correctAnswerIndex).toBeLessThan(question.options.length)
        expect(question.explanation).toBeTruthy()
      }
    }
  })

  it('should have roadmaps with ordered milestones and valid links', () => {
    expect(INITIAL_ROADMAPS.length).toBeGreaterThan(0)
    for (const roadmap of INITIAL_ROADMAPS) {
      expect(roadmap.milestones.length).toBeGreaterThan(0)
      roadmap.milestones.forEach((milestone, idx) => {
        expect(milestone.order).toBe(idx + 1)
        expect(milestone.skills.length).toBeGreaterThan(0)
      })
    }
  })
})

describe('Student Learning Logic & Math', () => {
  it('calculates student level correctly based on XP', () => {
    const calcLevel = (xp: number) => Math.floor(xp / 200) + 1

    expect(calcLevel(0)).toBe(1)
    expect(calcLevel(150)).toBe(1)
    expect(calcLevel(200)).toBe(2)
    expect(calcLevel(399)).toBe(2)
    expect(calcLevel(450)).toBe(3)
    expect(calcLevel(1000)).toBe(6)
  })

  it('calculates course progress percentage accurately', () => {
    const calcProgress = (completedCount: number, totalCount: number) => {
      if (totalCount === 0) return 0
      return Math.round((completedCount / totalCount) * 100)
    }

    expect(calcProgress(0, 5)).toBe(0)
    expect(calcProgress(1, 4)).toBe(25)
    expect(calcProgress(2, 3)).toBe(67)
    expect(calcProgress(5, 5)).toBe(100)
    expect(calcProgress(0, 0)).toBe(0)
  })

  it('evaluates quiz passing threshold and XP gain correctly', () => {
    const evaluateQuiz = (score: number, total: number, baseReward: number) => {
      const percentage = Math.round((score / total) * 100)
      const passed = percentage >= 60
      const xpGained = passed ? Math.round((baseReward * score) / total) : 25
      const isPerfect = score === total
      return { passed, percentage, xpGained, isPerfect }
    }

    // 4 out of 4 (100%) -> Pass, perfect, full XP
    const perfect = evaluateQuiz(4, 4, 150)
    expect(perfect.passed).toBe(true)
    expect(perfect.percentage).toBe(100)
    expect(perfect.xpGained).toBe(150)
    expect(perfect.isPerfect).toBe(true)

    // 3 out of 4 (75%) -> Pass
    const good = evaluateQuiz(3, 4, 150)
    expect(good.passed).toBe(true)
    expect(good.percentage).toBe(75)
    expect(good.xpGained).toBe(113)
    expect(good.isPerfect).toBe(false)

    // 2 out of 4 (50%) -> Fail, consolation XP
    const failed = evaluateQuiz(2, 4, 150)
    expect(failed.passed).toBe(false)
    expect(failed.percentage).toBe(50)
    expect(failed.xpGained).toBe(25)
  })
})
