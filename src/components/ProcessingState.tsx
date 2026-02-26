'use client'

interface ProcessingStateProps {
  message: string
}

export default function ProcessingState({ message }: ProcessingStateProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 text-center py-16">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700">{message}</p>
      <p className="mt-1 text-xs text-gray-400">Detta kan ta 10–30 sekunder per faktura</p>
    </div>
  )
}
