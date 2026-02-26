'use client'

import { useRef, useState, useCallback } from 'react'

interface UploadZoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  onProcess: () => void
}

export default function UploadZone({ files, onFilesChange, onProcess }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    const pdfs = Array.from(incoming).filter((f) => f.type === 'application/pdf')
    if (pdfs.length === 0) return
    const existing = new Set(files.map((f) => f.name + f.size))
    const unique = pdfs.filter((f) => !existing.has(f.name + f.size))
    onFilesChange([...files, ...unique])
  }, [files, onFilesChange])

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    onFilesChange(updated)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-10 text-center
          ${dragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="text-sm font-medium text-gray-700">
          Dra och släpp PDF-fakturor här
        </p>
        <p className="mt-1 text-xs text-gray-400">
          eller klicka för att välja filer · Flera filer stöds
        </p>

        {/* Decorative corners */}
        <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-gray-200 rounded-tl" />
        <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-gray-200 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-gray-200 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-gray-200 rounded-br" />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit button */}
      {files.length > 0 && (
        <button
          onClick={onProcess}
          className="mt-5 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-md shadow-blue-500/20"
        >
          Bearbeta {files.length === 1 ? '1 faktura' : `${files.length} fakturor`}
        </button>
      )}
    </div>
  )
}
