import { NextRequest, NextResponse } from 'next/server'
import type { ExcelRow } from '@/types/invoice'

export const maxDuration = 60

const N8N_FORM_URL = process.env.N8N_FORM_URL!
const EXCEL_URL = process.env.EXCEL_URL!
const N8N_API_URL = process.env.N8N_API_URL!
const N8N_API_KEY = process.env.N8N_API_KEY!
const N8N_WORKFLOW_ID = '5V6p4Hqe5dV7iXQu'

function excelDateToISO(serial: number): string {
  const date = new Date((serial - 25569) * 86400 * 1000)
  return date.toISOString().split('T')[0]
}

async function getLatestExecutionRows(): Promise<ExcelRow[]> {
  // Get the most recent successful execution
  const listRes = await fetch(
    `${N8N_API_URL}/executions?workflowId=${N8N_WORKFLOW_ID}&status=success&limit=1`,
    { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
  )
  if (!listRes.ok) throw new Error(`n8n executions list error: ${listRes.status}`)

  const listData = await listRes.json()
  const latest = listData.data?.[0]
  if (!latest) throw new Error('No successful executions found')

  // Get full execution data including node outputs
  const detailRes = await fetch(
    `${N8N_API_URL}/executions/${latest.id}?includeData=true`,
    { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
  )
  if (!detailRes.ok) throw new Error(`n8n execution detail error: ${detailRes.status}`)

  const detail = await detailRes.json()

  // Extract "Svenska format" node output (clean string dates, before Excel serializes them)
  const svFormatItems =
    detail.data?.resultData?.runData?.['Svenska format']?.[0]?.data?.main?.[0]
  if (!svFormatItems || svFormatItems.length === 0) {
    throw new Error('Could not extract data from workflow execution')
  }

  return svFormatItems.map((item: { json: ExcelRow }) => item.json)
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

    // POST blocks until n8n workflow finishes (responseMode: "lastNode")
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

    // n8n Form Trigger returns 200 with empty body — fetch execution data via API
    const rawRows = await getLatestExecutionRows()

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
