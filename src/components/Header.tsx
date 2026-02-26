'use client'

export default function Header() {
  return (
    <header className="pt-10 pb-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mb-4">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
        Faktura-uppladdning
      </h1>
      <p className="mt-1.5 text-sm text-gray-500">
        Ladda upp PDF-fakturor — AI extraherar data och sparar i Excel
      </p>
    </header>
  )
}
