import { Course, Quiz, SkillRoadmap, Badge, Goal } from '../types/learning'

export const INITIAL_COURSES: Course[] = [
  {
    id: 'frontend-mastery',
    title: 'Modern Frontend Engineering with React & TypeScript',
    shortDescription: 'Master component architecture, state management, modern hooks, and scalable frontend design.',
    fullDescription: 'Become a job-ready modern frontend developer. This comprehensive course takes you from foundational React patterns up to advanced enterprise patterns with TypeScript, custom hooks, and performance tuning.',
    category: 'Frontend',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    totalDurationHours: 14.5,
    rating: 4.9,
    enrolledStudentsCount: 3840,
    tags: ['React', 'TypeScript', 'Vite', 'Frontend', 'Web Dev'],
    quizId: 'quiz-react-ts',
    instructor: {
      name: 'Alex Rivera',
      role: 'Staff Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Ex-Meta engineering lead with over 10 years of experience building massive scale web applications.'
    },
    modules: [
      {
        id: 'mod-1',
        title: 'Core Fundamentals: React 19 & TypeScript',
        description: 'Understand strict TypeScript typing, JSX internals, and the new React 19 paradigms.',
        lectures: [
          {
            id: 'lec-1-1',
            title: 'Welcome & Architecture Overview',
            durationMinutes: 12,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            summary: 'Get an overview of modern frontend engineering and set up your mental model for component-driven UI architecture.',
            notesMarkdown: `### Learning Objectives
- Understanding modern declarative frontend architecture
- The journey from vanilla DOM to component trees
- How TypeScript prevents runtime bugs before they hit production

\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'mentor' | 'admin';
}
\`\`\`
`,
            resources: [
              { id: 'res-1', title: 'React 19 Cheatsheet PDF', url: '#', type: 'pdf' },
              { id: 'res-2', title: 'Starter GitHub Repository', url: '#', type: 'code' }
            ]
          },
          {
            id: 'lec-1-2',
            title: 'Mastering TypeScript Props & Generics in Components',
            durationMinutes: 18,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            summary: 'Learn how to strongly type complex component props, discriminate unions, and use TypeScript generics.',
            notesMarkdown: `### Key Concepts
- Discriminated union props for conditional rendering
- Polymorphic \`as\` components in TypeScript
- Generic table/list components that guarantee type-safety
`,
            resources: [
              { id: 'res-3', title: 'Generic Component Snippets', url: '#', type: 'code' }
            ]
          },
          {
            id: 'lec-1-3',
            title: 'Modern State Strategies & Reducer Patterns',
            durationMinutes: 24,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            summary: 'Deep dive into useReducer, immutability, and state colocation best practices.',
            notesMarkdown: `### Best Practices
1. Keep state as close to where it's used as possible.
2. Prefer derived state over duplicated synchronized state.
3. Use strict action types in reducers.
`
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Component Lifecycles, Effects & Custom Hooks',
        description: 'Build production-ready custom hooks for data fetching, debounce, and local storage.',
        lectures: [
          {
            id: 'lec-2-1',
            title: 'Rules of Hooks & Effect Synchronization',
            durationMinutes: 20,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            summary: 'Avoid stale closures and infinite re-renders with proper dependency tracking.',
            notesMarkdown: `### Key Takeaway
Effects are for synchronizing with external systems, not for transforming state for rendering.
`
          },
          {
            id: 'lec-2-2',
            title: 'Building a Robust useLocalStorage Hook',
            durationMinutes: 22,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            summary: 'Step-by-step implementation of a TypeScript-safe local storage synchronizer.',
            notesMarkdown: `### The Hook Pattern
\`\`\`typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Sync state with browser window storage events
}
\`\`\`
`
          }
        ]
      }
    ]
  },
  {
    id: 'ai-ml-python',
    title: 'Applied AI & Machine Learning with Python',
    shortDescription: 'Learn Python for data science, neural networks, LLM integrations, and modern AI development.',
    fullDescription: 'From data wrangling with Pandas and NumPy to fine-tuning transformers and building autonomous AI agents with Python.',
    category: 'AI & ML',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    totalDurationHours: 18.0,
    rating: 4.95,
    enrolledStudentsCount: 5210,
    tags: ['Python', 'AI', 'Machine Learning', 'Data Science', 'LLMs'],
    quizId: 'quiz-ai-python',
    instructor: {
      name: 'Dr. Priya Sharma',
      role: 'AI Research Scientist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Machine learning researcher and advisor to cutting-edge generative AI startups.'
    },
    modules: [
      {
        id: 'mod-ai-1',
        title: 'Foundations of Modern AI & Python Essentials',
        description: 'Set up Python, Jupyter, NumPy arrays, and understand vector embeddings.',
        lectures: [
          {
            id: 'lec-ai-1',
            title: 'The AI Landscape: From Linear Models to GenAI',
            durationMinutes: 15,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            summary: 'An intuitive journey through classification, neural networks, embeddings, and prompt engineering.',
            notesMarkdown: `### Core Roadmap
- Structured Data vs Unstructured Data
- What are Vector Embeddings?
- Tokenization & Large Language Models
`
          },
          {
            id: 'lec-ai-2',
            title: 'Vector Math & NumPy for Deep Learning',
            durationMinutes: 25,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            summary: 'Matrix multiplications, dot products, and cosine similarity explained visually.',
            notesMarkdown: `### Cosine Similarity Formula
Cosine similarity measures the angle between two embedding vectors in multidimensional space.
`
          }
        ]
      },
      {
        id: 'mod-ai-2',
        title: 'Building Practical AI Agents & RAG',
        description: 'Connect vector databases, retrieval augmented generation, and tool-calling models.',
        lectures: [
          {
            id: 'lec-ai-3',
            title: 'Retrieval Augmented Generation (RAG) Architecture',
            durationMinutes: 30,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            summary: 'Build your first domain-specific knowledge retriever using semantic chunking.',
            notesMarkdown: `### RAG Pipeline Steps
1. Document Ingestion & Chunking
2. Embedding Generation
3. Vector Store Querying
4. LLM Context Augmentation & Synthesis
`
          }
        ]
      }
    ]
  },
  {
    id: 'backend-node-api',
    title: 'Scalable Backend APIs with Node.js & PostgreSQL',
    shortDescription: 'Design RESTful & GraphQL microservices, database schemas, authentication, and caching.',
    fullDescription: 'Master production-grade backend engineering: relational databases, indexing, JWT auth, connection pooling, and Docker deployment.',
    category: 'Backend',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    totalDurationHours: 16.0,
    rating: 4.85,
    enrolledStudentsCount: 2950,
    tags: ['Node.js', 'PostgreSQL', 'Express', 'API', 'Docker'],
    quizId: 'quiz-backend-sql',
    instructor: {
      name: 'Marcus Chen',
      role: 'Principal Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Author of Cloud Resiliency Systems and former infrastructure lead.'
    },
    modules: [
      {
        id: 'mod-be-1',
        title: 'Relational Database Architecture & Indexing',
        description: 'PostgreSQL schema design, normalization, foreign keys, and query optimization.',
        lectures: [
          {
            id: 'lec-be-1',
            title: 'Designing Bulletproof Schemas in PostgreSQL',
            durationMinutes: 20,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            summary: 'Constraints, foreign keys, migrations, and normalization principles.',
            notesMarkdown: `### Relational Modeling
- Primary keys & UUID strategies
- One-to-many vs Many-to-many junction tables
- Indexing strategies for B-trees
`
          },
          {
            id: 'lec-be-2',
            title: 'Secure Authentication & JWT Token Rotations',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            summary: 'Implement secure access tokens, httpOnly refresh cookies, and session invalidation.',
            notesMarkdown: `### Security Checklist
- Store refresh tokens in HttpOnly, SameSite strict cookies
- Short expiration for access tokens (15m)
- Rate limiting on auth endpoints
`
          }
        ]
      }
    ]
  },
  {
    id: 'ui-ux-design-systems',
    title: 'UI/UX Design Systems & Figma for Developers',
    shortDescription: 'Bridge the gap between design and engineering. Build cohesive, accessible design systems.',
    fullDescription: 'Learn typography, color theory, spacing tokens, responsive layouts, and how to translate design tokens into reusable code.',
    category: 'Design',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    totalDurationHours: 11.0,
    rating: 4.88,
    enrolledStudentsCount: 2150,
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Accessibility'],
    quizId: 'quiz-ui-ux',
    instructor: {
      name: 'Elena Rostova',
      role: 'Head of Product Design',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      bio: 'Design systems lead passionate about WCAG 2.1 accessibility and clean typography.'
    },
    modules: [
      {
        id: 'mod-ui-1',
        title: 'Design Foundations: Tokens, Colors & Grids',
        description: 'Harmonious color palettes, modular scales for typography, and 8pt grid systems.',
        lectures: [
          {
            id: 'lec-ui-1',
            title: 'Design Tokens: Variables that Scale Across Platforms',
            durationMinutes: 16,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            summary: 'Learn how to define semantic tokens for colors, spacing, and elevation.',
            notesMarkdown: `### Design Tokens Hierarchy
1. Global / Primitive Tokens: \`color-blue-500: #3b82f6\`
2. Semantic Tokens: \`color-action-primary: var(--color-blue-500)\`
3. Component Tokens: \`btn-primary-bg: var(--color-action-primary)\`
`
          }
        ]
      }
    ]
  }
]

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-react-ts',
    title: 'React & TypeScript Mastery Assessment',
    topic: 'Frontend & TypeScript',
    courseId: 'frontend-mastery',
    level: 'Intermediate',
    timeLimitMinutes: 10,
    xpReward: 150,
    questions: [
      {
        id: 'q1',
        question: 'Which TypeScript utility type is used to construct a type with all properties of T set to optional?',
        options: ['Required<T>', 'Partial<T>', 'Pick<T, K>', 'Record<K, T>'],
        correctAnswerIndex: 1,
        explanation: '`Partial<T>` makes all properties of the given interface optional, making it ideal for patch operations and optional props.'
      },
      {
        id: 'q2',
        question: 'In React 19, what is the recommended way to handle asynchronous data transitions without blocking the UI?',
        options: ['useAsyncEffect()', 'useTransition() & action states', 'setTimeout() wrapper', 'window.requestIdleCallback'],
        correctAnswerIndex: 1,
        explanation: '`useTransition` allows you to mark state updates as non-blocking transitions so the UI remains responsive during background updates.'
      },
      {
        id: 'q3',
        question: 'What is the primary benefit of using discriminated unions in component props?',
        options: [
          'They speed up the browser JS engine',
          'They allow the compiler to enforce mutually exclusive props combinations',
          'They automatically import CSS stylesheets',
          'They convert functional components to classes'
        ],
        correctAnswerIndex: 1,
        explanation: 'Discriminated unions use a common literal discriminator property so TypeScript ensures invalid prop combinations are caught at compile-time.'
      },
      {
        id: 'q4',
        question: 'When should you avoid using `useEffect` in React?',
        options: [
          'When synchronizing with an external WebSocket server',
          'When subscribing to browser resize events',
          'For transforming data or calculating values that can be derived during render',
          'When initializing an imperative canvas context'
        ],
        correctAnswerIndex: 2,
        explanation: 'Values that can be computed during render should be derived directly or memoized with `useMemo`, not stored in extra state synchronized via `useEffect`.'
      }
    ]
  },
  {
    id: 'quiz-ai-python',
    title: 'AI & Python Foundations Check',
    topic: 'Artificial Intelligence & Machine Learning',
    courseId: 'ai-ml-python',
    level: 'Beginner',
    timeLimitMinutes: 8,
    xpReward: 120,
    questions: [
      {
        id: 'q-ai-1',
        question: 'What does RAG stand for in modern AI application architecture?',
        options: [
          'Randomized Adaptive Gradient',
          'Retrieval-Augmented Generation',
          'Recursive Automated Graph',
          'Realtime Asynchronous Gateway'
        ],
        correctAnswerIndex: 1,
        explanation: 'Retrieval-Augmented Generation (RAG) retrieves relevant documents from an external vector store to augment the prompt provided to an LLM.'
      },
      {
        id: 'q-ai-2',
        question: 'Which metric is most commonly used to measure semantic similarity between two normalized embedding vectors?',
        options: ['Euclidean distance', 'Cosine similarity', 'Hamming distance', 'Jaccard index'],
        correctAnswerIndex: 1,
        explanation: 'Cosine similarity computes the cosine of the angle between two non-zero vectors, making it scale-invariant and ideal for embeddings.'
      },
      {
        id: 'q-ai-3',
        question: 'In Python NumPy, what does vectorization achieve?',
        options: [
          'Compiles code into HTML canvas animations',
          'Executes batch array operations in optimized C loops without slow Python for-loops',
          'Encrypts memory addresses for safety',
          'Automatically downloads pip packages'
        ],
        correctAnswerIndex: 1,
        explanation: 'Vectorized operations delegate repetitive calculations to low-level compiled C/Fortran routines, boosting performance by 10x-100x.'
      }
    ]
  },
  {
    id: 'quiz-backend-sql',
    title: 'Relational Databases & Node API Assessment',
    topic: 'Backend & Databases',
    courseId: 'backend-node-api',
    level: 'Intermediate',
    timeLimitMinutes: 10,
    xpReward: 140,
    questions: [
      {
        id: 'q-be-1',
        question: 'Where should a secure JWT refresh token be stored on the client side?',
        options: [
          'In window.localStorage',
          'In an HttpOnly, Secure, SameSite cookie',
          'In window.sessionStorage',
          'In a global window variable'
        ],
        correctAnswerIndex: 1,
        explanation: 'HttpOnly cookies cannot be read or stolen by malicious client-side JavaScript scripts (XSS attacks), providing maximum security.'
      },
      {
        id: 'q-be-2',
        question: 'What type of database index is the default in PostgreSQL for equality and range queries?',
        options: ['Hash index', 'B-Tree index', 'GiST index', 'GIN index'],
        correctAnswerIndex: 1,
        explanation: 'B-Tree (Balanced Tree) is the default and versatile index in PostgreSQL, offering O(log n) lookups for equality and ranges.'
      }
    ]
  },
  {
    id: 'quiz-ui-ux',
    title: 'UI Design Systems & Accessibility Check',
    topic: 'Design Systems',
    courseId: 'ui-ux-design-systems',
    level: 'Beginner',
    timeLimitMinutes: 6,
    xpReward: 100,
    questions: [
      {
        id: 'q-ui-1',
        question: 'According to WCAG 2.1 AA standards, what is the minimum contrast ratio for normal body text against its background?',
        options: ['3.0 : 1', '4.5 : 1', '7.0 : 1', '2.5 : 1'],
        correctAnswerIndex: 1,
        explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text (and 3:1 for large text).'
      }
    ]
  }
]

export const INITIAL_ROADMAPS: SkillRoadmap[] = [
  {
    id: 'roadmap-frontend',
    title: 'Frontend Developer Pathway',
    description: 'A comprehensive, step-by-step roadmap to become a high-impact modern Frontend Engineer.',
    category: 'Web Development',
    icon: '💻',
    estimatedWeeks: 12,
    milestones: [
      {
        id: 'ms-fe-1',
        order: 1,
        title: 'HTML5, Semantic Web & CSS Layouts',
        description: 'Master semantic elements, accessibility fundamentals, CSS Flexbox, and CSS Grid.',
        skills: ['Semantic HTML', 'Flexbox & Grid', 'Responsive Units (rem, ch, vh)', 'WCAG Basics']
      },
      {
        id: 'ms-fe-2',
        order: 2,
        title: 'Modern JavaScript (ES6+) & Asynchronous DOM',
        description: 'Promises, Async/Await, Fetch API, Closures, Prototypes, and DOM manipulation.',
        skills: ['Arrow functions & Destructuring', 'Event Loop & Promises', 'Modules & ESNext', 'Error Handling']
      },
      {
        id: 'ms-fe-3',
        order: 3,
        title: 'React & Component-Driven Architecture',
        description: 'JSX, State & Props, Custom Hooks, Context API, and standard component design patterns.',
        skills: ['Components & Props', 'useState & useEffect', 'Custom Hooks', 'Virtual DOM & Reconciliation'],
        linkedCourseId: 'frontend-mastery',
        linkedQuizId: 'quiz-react-ts'
      },
      {
        id: 'ms-fe-4',
        order: 4,
        title: 'TypeScript for Scale',
        description: 'Add static type checking to eliminate runtime errors and design maintainable component APIs.',
        skills: ['Generics', 'Utility Types', 'Strict Null Checks', 'TSConfig Optimization'],
        linkedCourseId: 'frontend-mastery',
        linkedQuizId: 'quiz-react-ts'
      },
      {
        id: 'ms-fe-5',
        order: 5,
        title: 'Design Systems & Performance Optimization',
        description: 'Core Web Vitals, code splitting, asset optimization, and building cohesive design tokens.',
        skills: ['Lighthouse Audits', 'Design Tokens', 'Lazy Loading & Suspense', 'Tree Shaking'],
        linkedCourseId: 'ui-ux-design-systems',
        linkedQuizId: 'quiz-ui-ux'
      }
    ]
  },
  {
    id: 'roadmap-ai-engineer',
    title: 'AI & Data Science Pathway',
    description: 'From Python data wrangling to deep learning, vector databases, and generative AI agents.',
    category: 'Artificial Intelligence',
    icon: '🧠',
    estimatedWeeks: 16,
    milestones: [
      {
        id: 'ms-ai-1',
        order: 1,
        title: 'Python for Scientific Computing',
        description: 'Python syntax, data structures, list comprehensions, object-oriented concepts, and package managers.',
        skills: ['Python 3.12', 'Virtual Environments', 'OOP in Python', 'File I/O & JSON']
      },
      {
        id: 'ms-ai-2',
        order: 2,
        title: 'Data Analysis with NumPy & Pandas',
        description: 'Vectorized operations, data cleaning, filtering, aggregation, and visualizations with Matplotlib/Seaborn.',
        skills: ['DataFrames & Series', 'Handling Missing Values', 'Array Broadcasting', 'Exploratory Data Analysis']
      },
      {
        id: 'ms-ai-3',
        order: 3,
        title: 'Machine Learning Fundamentals',
        description: 'Supervised vs Unsupervised learning, linear regression, decision trees, cross-validation, and metrics.',
        skills: ['Scikit-Learn', 'Train/Test Split', 'F1-Score & ROC-AUC', 'Feature Scaling']
      },
      {
        id: 'ms-ai-4',
        order: 4,
        title: 'Generative AI, Embeddings & RAG Systems',
        description: 'Harness LLMs, create semantic search with vector databases (Chroma/Pinecone), and build agentic workflows.',
        skills: ['Vector Embeddings', 'Cosine Similarity', 'RAG Architecture', 'Prompt Engineering'],
        linkedCourseId: 'ai-ml-python',
        linkedQuizId: 'quiz-ai-python'
      }
    ]
  },
  {
    id: 'roadmap-fullstack',
    title: 'Fullstack Systems Pathway',
    description: 'Unify frontend reactivity with resilient backend microservices, SQL databases, and cloud deployments.',
    category: 'Fullstack',
    icon: '⚡',
    estimatedWeeks: 18,
    milestones: [
      {
        id: 'ms-fs-1',
        order: 1,
        title: 'Frontend Fundamentals',
        description: 'Solid UI foundations with modern React, responsive layouts, and state management.',
        skills: ['React', 'TypeScript', 'CSS Flexbox/Grid', 'Client Routing'],
        linkedCourseId: 'frontend-mastery'
      },
      {
        id: 'ms-fs-2',
        order: 2,
        title: 'Backend Services & REST APIs',
        description: 'Node.js, Express, async middlewares, validation, and structured error responses.',
        skills: ['Node.js', 'RESTful API Design', 'Middleware Pipelines', 'CORS & Security Headers'],
        linkedCourseId: 'backend-node-api',
        linkedQuizId: 'quiz-backend-sql'
      },
      {
        id: 'ms-fs-3',
        order: 3,
        title: 'Databases & ORMs',
        description: 'PostgreSQL modeling, migrations, indexing, transactions, and Prisma/Drizzle ORMs.',
        skills: ['PostgreSQL', 'Schema Normalization', 'ACID Transactions', 'Connection Pooling'],
        linkedCourseId: 'backend-node-api',
        linkedQuizId: 'quiz-backend-sql'
      },
      {
        id: 'ms-fs-4',
        order: 4,
        title: 'Deployment, CI/CD & Cloud Infrastructure',
        description: 'Containerize with Docker, setup automated GitHub Actions, and deploy to modern edge clouds.',
        skills: ['Docker', 'CI/CD Pipelines', 'Environment Configs', 'Monitoring & Logs']
      }
    ]
  }
]

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'First Step',
    description: 'Enrolled in your first learning course on the platform.',
    icon: '🚀'
  },
  {
    id: 'badge-knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Completed your first interactive video lecture.',
    icon: '🎓'
  },
  {
    id: 'badge-quiz-champ',
    title: 'Quiz Champion',
    description: 'Passed a knowledge assessment with 100% score.',
    icon: '🏆'
  },
  {
    id: 'badge-streak-fire',
    title: 'On Fire',
    description: 'Maintained an active 3-day continuous learning streak.',
    icon: '🔥'
  },
  {
    id: 'badge-roadmap-pioneer',
    title: 'Roadmap Pioneer',
    description: 'Completed your first skill milestone on a career roadmap.',
    icon: '🗺️'
  }
]

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-lectures',
    title: 'Complete 3 Lectures this week',
    targetCount: 3,
    currentCount: 1,
    unit: 'lectures',
    period: 'weekly',
    completed: false
  },
  {
    id: 'goal-quiz',
    title: 'Take & pass 1 skill quiz',
    targetCount: 1,
    currentCount: 0,
    unit: 'quizzes',
    period: 'weekly',
    completed: false
  },
  {
    id: 'goal-study-time',
    title: 'Study for 60 minutes today',
    targetCount: 60,
    currentCount: 45,
    unit: 'minutes',
    period: 'daily',
    completed: false
  }
]
