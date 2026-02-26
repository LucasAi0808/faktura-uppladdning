'use client'

import type { ExcelRow } from '@/types/invoice'

interface ResultTableProps {
  rows: ExcelRow[]
  excelUrl: string
  onReset: () => void
}

export default function ResultTable({ rows, excelUrl, onReset }: ResultTableProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/25 mb-4">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {rows.length === 1 ? '1 faktura bearbetad' : `${rows.length} fakturor bearbetade`}
        </h2>
        <p className="mt-1 text-sm text-gray-500">Data är sparat i Excel-arket</p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Leverantör', 'Datum', 'Fakturanr', 'Netto', 'Netto+10%', 'Vecka', 'Period'].map((col) => (
                  <th key={col} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{row['Leverantör'] || '—'}</td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{String(row['Datum']) || '—'}</td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap font-mono text-xs">{row['Fakturanr'] || '—'}</td>
                  <td className="px-5 py-4 text-gray-900 whitespace-nowrap">{row['Netto'] || '—'}</td>
                  <td className="px-5 py-4 text-gray-900 whitespace-nowrap">{row['Netto+10%'] || '—'}</td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{row['Vecka'] ?? '—'}</td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{row['Period'] || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={excelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-md shadow-emerald-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Öppna i Excel
        </a>

        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Ladda upp fler
        </button>
      </div>
    </div>
  )
}
