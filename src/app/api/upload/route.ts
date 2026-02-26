import { NextRequest, NextResponse } from 'next/server'
import type { ExcelRow } from '@/types/invoice'

export const maxDuration = 60

const N8N_FORM_URL = process.env.N8N_FORM_URL!
const EXCEL_URL = process.env.EXCEL_URL!

function excelDateToISO(serial: number): string {
  // Excel serial → JS Date (accounting for Excel's 1900 leap-year bug)
  const date = new Date((serial - 25569) * 86400 * 1000)
  return date.toISOString().split('T')[0]
}

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.formData()
    const files = incoming.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Inga filer valda.', code: 'NO_FILES' },
        { status: 400 }
      )
    }

    // Build multipart with the exact field name n8n form trigger expects
    const n8nFormData = new FormData()
    for (const file of files) {
      n8nFormData.append('Välj PDF-fakturor', file)
    }

    const n8nResponse = await fetch(N8N_FORM_URL, {
      method: 'POST',
      body: n8nFormData,
    })

    if (!n8nResponse.ok) {
      const text = await n8nResponse.text()
      console.error('n8n error:', n8nResponse.status, text)
      return NextResponse.json(
        { success: false, error: 'Workflowet returnerade ett fel.', code: 'N8N_ERROR' },
        { status: 502 }
      )
    }

    const raw = await n8nResponse.json()

    // Normalize response: could be array or single object
    const rawRows: ExcelRow[] = Array.isArray(raw) ? raw : [raw]

    // Convert Excel date serials to ISO strings
    const rows = rawRows.map((row) => ({
      ...row,
      Datum: typeof row.Datum === 'number' ? excelDateToISO(row.Datum) : row.Datum,
    }))

    return NextResponse.json({ success: true, rows, excelUrl: EXCEL_URL })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Kunde inte bearbeta fakturan. Försök igen.', code: 'PROCESSING_ERROR' },
      { status: 500 }
    )
  }
}
