'use client'

import Header from '@/components/Header'
import UploadZone from '@/components/UploadZone'
import ProcessingState from '@/components/ProcessingState'
import ResultTable from '@/components/ResultTable'
import ErrorResult from '@/components/ErrorResult'
import { useUploader } from '@/hooks/useUploader'

export default function Home() {
  const { status, files, result, error, statusMessage, setFiles, process, reset } = useUploader()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col justify-center py-8 pb-16">
        {(status === 'idle' || status === 'ready') && (
          <UploadZone files={files} onFilesChange={setFiles} onProcess={process} />
        )}

        {status === 'processing' && (
          <ProcessingState message={statusMessage} />
        )}

        {status === 'success' && result && (
          <ResultTable rows={result.rows} excelUrl={result.excelUrl} onReset={reset} />
        )}

        {status === 'error' && error && (
          <ErrorResult error={error.error} onRetry={reset} />
        )}
      </main>

      <footer className="py-5 text-center">
        <p className="text-xs text-gray-400">Powered by n8n · AI by OpenAI</p>
      </footer>
    </div>
  )
}
