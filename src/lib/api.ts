import type { ApiResponse } from '@/types/invoice'

export async function uploadInvoices(files: File[]): Promise<ApiResponse> {
  const formData = new FormData()
  for (const file of files) {
    formData.append('files', file)
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      success: false,
      error: data.error ?? 'Något gick fel. Försök igen.',
      code: data.code,
    }
  }

  return data as ApiResponse
}
