import { useState, useEffect } from 'react'
import { analyzeIdea, generateShareableUrl } from './analyzer'
import type { ValidationResult } from './types'

const EXAMPLES = [
  "A SaaS tool for indie developers to track MRR and churn without needing a data team",
  "A newsletter helping founders understand legal basics without hiring lawyers",
  "A marketplace connecting senior engineers with early-stage startups for part-time advisory work",
  "An app that helps content creators repurpose long videos into Twitter threads automatically",
]

function ScoreRing({ score, label }: { score: number; label: string }) {
  const colors: Record<string, string> = {
    Strong: '#22c55e',
    Viable: '#3b82f6',
    Risky: '#f59e0b',
    Avoid: '#ef4444',
  }
  const color = colors[label] || '#6b7280'
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="50" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
          {score}
        </text>
        <text x="50" y="62" textAnchor="middle" fill="#9ca3af" fontSize="10">
          / 100
        </text>
      </svg>
      <span className="text-sm font-semibold" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-white font-semibold text-lg">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
      {children}
    </span>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{children}</span>
}

function ResultView({ result, onReset, shareUrl }: { result: ValidationResult; onReset: () => void; shareUrl: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const verdictBg: Record<string, string> = {
    Strong: 'bg-green-950 border-green-800',
    Viable: 'bg-blue-950 border-blue-800',
    Risky: 'bg-amber-950 border-amber-800',
    Avoid: 'bg-red-950 border-red-800',
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← New idea
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? '✓ Copied!' : '🔗 Share'}
        </button>
      </div>

      {/* Idea summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <Label>Validating idea</Label>
        <p className="mt-1 text-white text-sm leading-relaxed">{result.idea}</p>
      </div>

      {/* Verdict */}
      <div className={`border rounded-2xl p-6 flex gap-6 items-start ${verdictBg[result.verdict.label]}`}>
        <ScoreRing score={result.verdict.score} label={result.verdict.label} />
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-white font-bold text-xl">Minimalist Verdict</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{result.verdict.summary}</p>
          <div className="mt-1">
            <Label>Top risk</Label>
            <p className="text-amber-400 text-sm mt-1">⚠️ {result.verdict.topRisk}</p>
          </div>
          <div className="mt-1">
            <Label>Next step</Label>
            <p className="text-green-400 text-sm mt-1">→ {result.verdict.nextStep}</p>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* True Fans */}
        <Card title="1,000 True Fans" icon="🎯">
          <div>
            <Label>Who they are</Label>
            <p className="text-gray-300 text-sm mt-1">{result.trueFans.profile}</p>
          </div>
          <div>
            <Label>Their pain</Label>
            <p className="text-gray-300 text-sm mt-1">"{result.trueFans.painPoint}"</p>
          </div>
          <div>
            <Label>Where to find them</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.trueFans.whereToFind.map((place) => (
                <Tag key={place}>{place}</Tag>
              ))}
            </div>
          </div>
          <div>
            <Label>Willingness to pay</Label>
            <p className="text-gray-300 text-sm mt-1">{result.trueFans.willingness}</p>
          </div>
        </Card>

        {/* Community */}
        <Card title="Community to Build In" icon="🏘️">
          <div>
            <Label>Best platform</Label>
            <p className="text-blue-400 font-semibold mt-1">{result.community.platform}</p>
          </div>
          <div>
            <Label>Why here</Label>
            <p className="text-gray-300 text-sm mt-1">{result.community.rationale}</p>
          </div>
          <div>
            <Label>Existing communities</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.community.existingCommunities.map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
            </div>
          </div>
          <div>
            <Label>Build strategy</Label>
            <p className="text-gray-300 text-sm mt-1">{result.community.buildStrategy}</p>
          </div>
        </Card>

        {/* MVP */}
        <Card title="Smallest Viable Product" icon="🔨">
          <div>
            <Label>Core solution</Label>
            <p className="text-gray-300 text-sm mt-1">{result.mvp.coreSolution}</p>
          </div>
          <div>
            <Label>Build this first</Label>
            <ul className="mt-1 space-y-1">
              {result.mvp.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-sm text-gray-300">
                  <span className="text-green-400 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label>Skip for now</Label>
            <ul className="mt-1 space-y-1">
              {result.mvp.skipFeatures.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-sm text-gray-500">
                  <span className="text-red-500 mt-0.5">✗</span> {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label>Estimated build time</Label>
            <p className="text-gray-300 text-sm mt-1">⏱ {result.mvp.buildTime}</p>
          </div>
          <div>
            <Label>Tech stack</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.mvp.techStack.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </Card>

        {/* Revenue */}
        <Card title="Revenue Model" icon="💰">
          <div>
            <Label>Model</Label>
            <p className="text-emerald-400 font-semibold mt-1">{result.revenue.model}</p>
          </div>
          <div>
            <Label>Pricing</Label>
            <p className="text-gray-300 text-sm mt-1">{result.revenue.pricing}</p>
          </div>
          <div>
            <Label>Path to $10K MRR</Label>
            <p className="text-gray-300 text-sm mt-1">{result.revenue.pathTo1000}</p>
          </div>
          <div>
            <Label>Alternatives to explore</Label>
            <ul className="mt-1 space-y-1">
              {result.revenue.alternatives.map((a) => (
                <li key={a} className="flex items-start gap-1.5 text-sm text-gray-400">
                  <span className="text-blue-400 mt-0.5">→</span> {a}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Footer framework note */}
      <p className="text-center text-gray-600 text-xs">
        Framework based on{' '}
        <a
          href="https://minentrepreneur.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-400 underline"
        >
          The Minimalist Entrepreneur
        </a>{' '}
        by Sahil Lavingia
      </p>
    </div>
  )
}

export default function App() {
  const [idea, setIdea] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  // Load idea from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlIdea = params.get('idea')
    if (urlIdea) {
      const decoded = decodeURIComponent(urlIdea)
      setIdea(decoded)
      handleAnalyze(decoded)
    }
  }, [])

  const handleAnalyze = (ideaText?: string) => {
    const toAnalyze = ideaText || idea
    if (!toAnalyze.trim()) return
    setLoading(true)
    // Simulate brief "thinking" delay for UX
    setTimeout(() => {
      const analysisResult = analyzeIdea(toAnalyze)
      setResult(analysisResult)
      setShareUrl(generateShareableUrl(toAnalyze))
      setLoading(false)
    }, 800)
  }

  const handleReset = () => {
    setResult(null)
    setIdea('')
    window.history.replaceState({}, '', window.location.pathname)
  }

  const handleExample = (example: string) => {
    setIdea(example)
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <ResultView result={result} onReset={handleReset} shareUrl={shareUrl} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-10 flex-1 w-full">
        {/* Hero */}
        <div className="text-center flex flex-col gap-3">
          <div className="text-4xl">🌱</div>
          <h1 className="text-3xl font-bold text-white">Minimalist Idea Validator</h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Enter a startup idea. Get a structured breakdown using the{' '}
            <span className="text-white font-medium">Minimalist Entrepreneur</span> framework —
            who your 1,000 true fans are, where to find them, what to build first, and how to make money.
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-3">
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-gray-500 transition-colors min-h-28"
            placeholder="Describe your startup idea in one or two sentences. Be specific about who it's for and what problem it solves..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze()
            }}
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={!idea.trim() || loading}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all bg-white text-gray-950 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              'Validate Idea →'
            )}
          </button>
          <p className="text-center text-gray-600 text-xs">⌘ + Enter to submit</p>
        </div>

        {/* Example ideas */}
        <div className="flex flex-col gap-3">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider text-center">Try an example</p>
          <div className="grid grid-cols-1 gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                onClick={() => handleExample(example)}
                className="text-left text-sm text-gray-400 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-3 transition-all"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-700 text-xs">
        Inspired by{' '}
        <a href="https://github.com/slavingia/skills" className="text-gray-600 hover:text-gray-500 underline" target="_blank" rel="noopener noreferrer">
          slavingia/skills
        </a>{' '}
        · Built by{' '}
        <a href="https://mvp.trollefsen.com" className="text-gray-600 hover:text-gray-500 underline">
          Nightly MVP Builder
        </a>
      </footer>
    </div>
  )
}
