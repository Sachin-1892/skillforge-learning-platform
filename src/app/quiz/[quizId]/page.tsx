'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLearning } from '../../../context/LearningContext'
import ProgressBar from '../../../components/common/ProgressBar'

export default function QuizViewPage() {
  const params = useParams()
  const quizId = params.quizId as string

  const { quizzes, submitQuizResult, courses } = useLearning()
  const quiz = quizzes.find((q) => q.id === quizId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [resultSummary, setResultSummary] = useState<{
    score: number
    passed: boolean
    xpGained: number
    newBadgeUnlocked: boolean
  } | null>(null)

  // Countdown timer
  const [secondsLeft, setSecondsLeft] = useState(
    (quiz?.timeLimitMinutes || 10) * 60
  )

  useEffect(() => {
    if (isFinished || secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isFinished, secondsLeft])

  if (!quiz) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <h2>Quiz not found</h2>
        <Link href="/quizzes" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Quizzes
        </Link>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentIndex]
  const userSelectedOption = selectedAnswers[currentIndex]
  const hasSelected = userSelectedOption !== undefined

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: idx
    }))
  }

  const handleCheckAnswer = () => {
    setIsAnswerChecked(true)
  }

  const handleNextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsAnswerChecked(selectedAnswers[currentIndex + 1] !== undefined)
    } else {
      // Calculate final score
      let score = 0
      quiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswerIndex) {
          score += 1
        }
      })

      const res = submitQuizResult(quiz.id, score, quiz.questions.length)
      setResultSummary({
        score,
        passed: res.passed,
        xpGained: res.xpGained,
        newBadgeUnlocked: res.newBadgeUnlocked
      })
      setIsFinished(true)
    }
  }

  const handleRetake = () => {
    setCurrentIndex(0)
    setSelectedAnswers({})
    setIsAnswerChecked(false)
    setIsFinished(false)
    setResultSummary(null)
    setSecondsLeft(quiz.timeLimitMinutes * 60)
  }

  const linkedCourse = courses.find((c) => c.id === quiz.courseId)

  // Finished Results View
  if (isFinished && resultSummary) {
    const percentage = Math.round((resultSummary.score / quiz.questions.length) * 100)

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 0' }}>
        <div
          className="card"
          style={{
            padding: '40px',
            textAlign: 'center',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {resultSummary.passed ? '🎉' : '📚'}
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            {resultSummary.passed ? 'Assessment Passed!' : 'Assessment Completed'}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '24px' }}>
            {resultSummary.passed
              ? 'Great job! You have demonstrated strong mastery of this topic.'
              : 'Good effort! Review the explanations below and try again to improve your score.'}
          </p>

          <div
            style={{
              display: 'inline-flex',
              gap: '32px',
              padding: '20px 36px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              marginBottom: '28px'
            }}
          >
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: resultSummary.passed ? 'var(--success)' : 'var(--danger)' }}>
                {resultSummary.score} / {quiz.questions.length}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Score ({percentage}%)</div>
            </div>

            <div style={{ width: '1px', background: 'var(--border-color)' }} />

            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                +{resultSummary.xpGained} XP
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Earned</div>
            </div>
          </div>

          {resultSummary.newBadgeUnlocked && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                borderRadius: '999px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: 'var(--warning)',
                fontWeight: 700,
                fontSize: '14px',
                marginBottom: '24px'
              }}
            >
              <span>🏆</span> New Badge Unlocked: Quiz Champion!
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleRetake} className="btn btn-secondary">
              Retake Assessment ↺
            </button>
            {linkedCourse ? (
              <Link href={`/courses/${linkedCourse.id}`} className="btn btn-primary">
                Return to Course →
              </Link>
            ) : (
              <Link href="/quizzes" className="btn btn-primary">
                Explore More Quizzes →
              </Link>
            )}
          </div>
        </div>

        {/* Detailed Answer Review */}
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          Detailed Answer Review
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quiz.questions.map((q, idx) => {
            const userChoice = selectedAnswers[idx]
            const isCorrect = userChoice === q.correctAnswerIndex

            return (
              <div
                key={q.id}
                className="card"
                style={{
                  padding: '20px',
                  borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Question {idx + 1}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                    {isCorrect ? '✓ Correct (+XP)' : '✗ Incorrect'}
                  </span>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
                  {q.question}
                </div>

                <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                  <strong>Your Answer:</strong>{' '}
                  <span style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                    {userChoice !== undefined ? q.options[userChoice] : 'Not answered'}
                  </span>
                </div>

                {!isCorrect && (
                  <div style={{ fontSize: '13px', marginBottom: '10px' }}>
                    <strong>Correct Answer:</strong>{' '}
                    <span style={{ color: 'var(--success)' }}>{q.options[q.correctAnswerIndex]}</span>
                  </div>
                )}

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  💡 <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Active Quiz View
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 0' }}>
      {/* Quiz Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="/quizzes" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          ← Exit Quiz
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', fontSize: '13px', fontWeight: 600 }}>
          <span>⏱️ Time Remaining:</span>
          <span style={{ color: secondsLeft < 60 ? 'var(--danger)' : 'var(--text-primary)' }}>
            {formatTimer(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}%</span>
        </div>
        <ProgressBar value={((currentIndex + 1) / quiz.questions.length) * 100} height={6} />
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Topic: {quiz.topic}
        </span>
        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '8px 0 24px', lineHeight: 1.4 }}>
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = userSelectedOption === idx
            let optionClass = 'quiz-option'
            if (isSelected) optionClass += ' selected'

            if (isAnswerChecked) {
              if (idx === currentQuestion.correctAnswerIndex) {
                optionClass += ' correct'
              } else if (isSelected) {
                optionClass += ' incorrect'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerChecked}
                className={optionClass}
              >
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>

        {/* Answer Explanation once checked */}
        {isAnswerChecked && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '10px',
              background: userSelectedOption === currentQuestion.correctAnswerIndex
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${
                userSelectedOption === currentQuestion.correctAnswerIndex
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(239, 68, 68, 0.3)'
              }`,
              fontSize: '14px',
              lineHeight: 1.6
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '4px', color: userSelectedOption === currentQuestion.correctAnswerIndex ? 'var(--success)' : 'var(--danger)' }}>
              {userSelectedOption === currentQuestion.correctAnswerIndex ? '✓ Correct Answer!' : '✗ Not quite right.'}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex((prev) => prev - 1)
              setIsAnswerChecked(true)
            }
          }}
          disabled={currentIndex === 0}
          className="btn btn-secondary"
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          ← Back
        </button>

        {!isAnswerChecked ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!hasSelected}
            className="btn btn-primary"
            style={{ opacity: hasSelected ? 1 : 0.5 }}
          >
            Check Answer
          </button>
        ) : (
          <button onClick={handleNextQuestion} className="btn btn-primary">
            {currentIndex === quiz.questions.length - 1 ? 'Finish & View Score →' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}
