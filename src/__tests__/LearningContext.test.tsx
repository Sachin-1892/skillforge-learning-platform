import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LearningProvider, useLearning } from '../context/LearningContext'

// Helper testing component
const TestConsumer: React.FC = () => {
  const {
    progress,
    courses,
    enrollCourse,
    isEnrolled,
    toggleLectureCompletion,
    isLectureCompleted,
    getCourseProgress,
    submitQuizResult,
    toggleMilestone,
    isMilestoneCompleted
  } = useLearning()

  return (
    <div>
      <div data-testid="xp">{progress.xp}</div>
      <div data-testid="enrolled">{progress.enrolledCourseIds.join(',')}</div>
      <div data-testid="completed-lectures">{progress.completedLectureIds.join(',')}</div>
      <div data-testid="milestones">{progress.completedMilestoneIds.join(',')}</div>

      <button
        data-testid="enroll-btn"
        onClick={() => enrollCourse('ai-ml-python')}
      >
        Enroll AI
      </button>

      <button
        data-testid="complete-lecture-btn"
        onClick={() => toggleLectureCompletion('frontend-mastery', 'lec-1-2')}
      >
        Complete Lec 1-2
      </button>

      <button
        data-testid="quiz-perfect-btn"
        onClick={() => submitQuizResult('quiz-react-ts', 4, 4)}
      >
        Submit Perfect Quiz
      </button>

      <button
        data-testid="milestone-btn"
        onClick={() => toggleMilestone('ms-fe-2')}
      >
        Toggle MS 2
      </button>

      <div data-testid="is-enrolled-ai">
        {isEnrolled('ai-ml-python') ? 'yes' : 'no'}
      </div>

      <div data-testid="course-progress">
        {getCourseProgress('frontend-mastery').percentage}%
      </div>
    </div>
  )
}

describe('LearningContext Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders initial state with default progress', () => {
    render(
      <LearningProvider>
        <TestConsumer />
      </LearningProvider>
    )

    expect(screen.getByTestId('xp').textContent).toBe('450')
    expect(screen.getByTestId('enrolled').textContent).toContain('frontend-mastery')
    expect(screen.getByTestId('is-enrolled-ai').textContent).toBe('no')
  })

  it('enrolls in a new course and awards XP and first-step badge', async () => {
    render(
      <LearningProvider>
        <TestConsumer />
      </LearningProvider>
    )

    const enrollBtn = screen.getByTestId('enroll-btn')
    await act(async () => {
      enrollBtn.click()
    })

    expect(screen.getByTestId('enrolled').textContent).toContain('ai-ml-python')
    expect(screen.getByTestId('is-enrolled-ai').textContent).toBe('yes')
    // 450 + 50 = 500 XP
    expect(screen.getByTestId('xp').textContent).toBe('500')
  })

  it('toggles lecture completion and updates course progress percentage', async () => {
    render(
      <LearningProvider>
        <TestConsumer />
      </LearningProvider>
    )

    const completeBtn = screen.getByTestId('complete-lecture-btn')
    await act(async () => {
      completeBtn.click()
    })

    expect(screen.getByTestId('completed-lectures').textContent).toContain('frontend-mastery:lec-1-2')
    // 450 + 40 = 490 XP
    expect(screen.getByTestId('xp').textContent).toBe('490')
  })

  it('awards quiz champion badge on 100% quiz score', async () => {
    render(
      <LearningProvider>
        <TestConsumer />
      </LearningProvider>
    )

    const quizBtn = screen.getByTestId('quiz-perfect-btn')
    await act(async () => {
      quizBtn.click()
    })

    // 450 + 150 = 600 XP
    expect(screen.getByTestId('xp').textContent).toBe('600')
  })

  it('toggles roadmap milestone mastery and adds XP', async () => {
    render(
      <LearningProvider>
        <TestConsumer />
      </LearningProvider>
    )

    const msBtn = screen.getByTestId('milestone-btn')
    await act(async () => {
      msBtn.click()
    })

    expect(screen.getByTestId('milestones').textContent).toContain('ms-fe-2')
    // 450 + 60 = 510 XP
    expect(screen.getByTestId('xp').textContent).toBe('510')
  })
})
