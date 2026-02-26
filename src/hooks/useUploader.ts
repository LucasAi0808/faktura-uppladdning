'use client'

import { useState, useCallback } from 'react'
import type { ProcessingStatus, UploadSuccess, UploadError } from '@/types/invoice'
import { uploadInvoices } from '@/lib/api'

interface UseUploaderReturn {
  status: ProcessingStatus
  files: File[]
  result: (UploadSuccess & { excelUrl: string }) | null
  error: UploadError | null
  statusMessage: string
  setFiles: (files: File[]) => void
  process: () => Promise<void>
  reset: () => void
}

export function useUploader(): UseUploaderReturn {
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [files, setFilesState] = useState<File[]>([])
  const [result, setResult] = useState<(UploadSuccess & { excelUrl: string }) | null>(null)
  const [error, setError] = useState<UploadError | null>(null)
  const [statusMessage, setStatusMessage] = useState('')

  const setFiles = useCallback((newFiles: File[]) => {
    setFilesState(newFiles)
    setStatus(newFiles.length > 0 ? 'ready' : 'idle')
    setError(null)
  }, [])

  const process = useCallback(async () => {
    if (files.length === 0) return

    setStatus('processing')
    setStatusMessage('Laddar upp filer...')
    setError(null)
    setResult(null)

    try {
      await new Promise((r) => setTimeout(r, 400))
      setStatusMessage('AI extraherar fakturadata...')

      const response = await uploadInvoices(files)

      setStatusMessage('Sparar till Excel...')
      await new Promise((r) => setTimeout(r, 300))

      if (response.success) {
        setResult(response as UploadSuccess & { excelUrl: string })
        setStatus('success')
        setStatusMessage('Klart!')
      } else {
        setError(response)
        setStatus('error')
      }
    } catch (err) {
      setError({
        success: false,
        error: err instanceof Error ? err.message : 'Ett oväntat fel inträffade.',
      })
      setStatus('error')
    }
  }, [files])

  const reset = useCallback(() => {
    setStatus('idle')
    setFilesState([])
    setResult(null)
    setError(null)
    setStatusMessage('')
  }, [])

  return { status, files, result, error, statusMessage, setFiles, process, reset }
}
