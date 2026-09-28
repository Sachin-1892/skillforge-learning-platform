'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLearning } from '../../../context/LearningContext'
import { Quiz, QuizQuestion, SkillLevel } from '../../../types/learning'
import BadgePill from '../../../components/common/BadgePill'

export default function AdminQuizzesPage() {
  const { quizzes, addQuiz, deleteQuiz } = useLearning()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('Frontend Engineering')
  const [level, setLevel] = useState<SkillLevel>('Beginner')
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(10)
  const [xpReward, setXpReward] = useState(150)

  // Questions State
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-new-1',
      question: 'What is the primary benefit of React Server Components (RSC)?',
      options: [
        'They eliminate CSS stylesheets',
        'They reduce client bundle size by rendering on the server',
        'They replace TypeScript with Python',
        'They disable browser security'
      ],
      correctAnswerIndex: 1,
      explanation: 'React Server Components execute strictly on the server and send zero JavaScript to the client browser, minimizing bundle size.'
    }
  ])

  // Current question inputs
  const [qText, setQText] = useState('')
  const [opt0, setOpt0] = useState('')
  const [opt1, setOpt1] = useState('')
  const [opt2, setOpt2] = useState('')
  const [opt3, setOpt3] = useState('')
  const [correctIdx, setCorrectIdx] = useState(0)
  const [explanation, setExplanation] = useState('')

  const handleAddQuestion = () => {
    if (!qText.trim() || !opt0.trim() || !opt1.trim()) {
      alert('Please enter at least a question and 2 options.')
      return
    }

    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: qText,
      options: [opt0, opt1, opt2 || 'None of the above', opt3 || 'All of the above'],
      correctAnswerIndex: correctIdx,
      explanation: explanation || 'Correct answer verified.'
    }

    setQuestions((prev) => [...prev, newQ])
    setQText('')
    setOpt0('')
    setOpt1('')
    setOpt2('')
    setOpt3('')
    setExplanation('')
  }

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || questions.length === 0) {
      alert('Please provide a quiz title and at least one question.')
      return
    }

    const newQuiz: Omit<Quiz, 'id'> = {
      title,
      topic,
      level,
      timeLimitMinutes,
      xpReward,
      questions
    }

    addQuiz(newQuiz)
    setIsModalOpen(false)
    setTitle('')
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete quiz "${name}"?`)) {
      deleteQuiz(id)
    }
  }

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Link href="/admin" style={{ color: 'var(--text-secondary)' }}>Admin Studio</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>Quizzes</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Quiz & Assessment Studio</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Author knowledge checks, set question explanations, and configure student XP rewards.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          + Create New Quiz
        </button>
      </div>

      {/* Quizzes Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Quiz Title</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Topic</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Level</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Questions</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>Reward</th>
              <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((q) => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 700 }}>
                  {q.title}
                </td>
                <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                  {q.topic}
                </td>
                <td style={{ padding: '16px 16px' }}>
                  <BadgePill level={q.level} />
                </td>
                <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                  {q.questions.length} questions • {q.timeLimitMinutes}m
                </td>
                <td style={{ padding: '16px 16px', color: 'var(--brand-primary)', fontWeight: 700 }}>
                  +{q.xpReward} XP
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <Link
                      href={`/quiz/${q.id}`}
                      target="_blank"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      Test Quiz ↗
                    </Link>
                    <button
                      onClick={() => handleDelete(q.id, q.title)}
                      className="btn btn-sm"
                      style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create New Quiz Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="card"
            style={{
              padding: '28px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Create New Assessment</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Quiz Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js App Router Architecture Assessment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>XP Reward</label>
                  <input
                    type="number"
                    min="50"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Questions List */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    Questions ({questions.length})
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{idx + 1}. {q.question}</div>
                      <div style={{ color: 'var(--success)', fontSize: '12px', marginTop: '2px' }}>
                        ✓ Correct: {q.options[q.correctAnswerIndex]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Question Section */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>+ Add Question to Quiz</div>

                  <input
                    type="text"
                    placeholder="Enter question text..."
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '13px', marginBottom: '8px' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Option A (1)"
                      value={opt0}
                      onChange={(e) => setOpt0(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="Option B (2)"
                      value={opt1}
                      onChange={(e) => setOpt1(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="Option C (3)"
                      value={opt2}
                      onChange={(e) => setOpt2(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="Option D (4)"
                      value={opt3}
                      onChange={(e) => setOpt3(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '12px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Correct Answer:</span>
                    <select
                      value={correctIdx}
                      onChange={(e) => setCorrectIdx(Number(e.target.value))}
                      style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '12px' }}
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Explanation for students..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '12px', marginBottom: '8px' }}
                  />

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    + Add Question to Quiz
                  </button>
                </div>
              </div>

              {/* Submit Quiz */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publish Assessment ⚡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
