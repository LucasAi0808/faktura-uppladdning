'use client'

interface ErrorResultProps {
  error: string
  onRetry: () => void
}

export default function ErrorResult({ error, onRetry }: ErrorResultProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 text-center py-10">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mb-4">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Något gick fel</h2>
      <p className="text-sm text-gray-500 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-colors"
      >
        Försök igen
      </button>
    </div>
  )
}
