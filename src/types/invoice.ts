export interface ExcelRow {
  'Leverantör': string
  'Datum': number | string
  'Fakturanr': string
  'Netto': string
  'Netto+10%': string
  'Vecka': number
  'Period': string
}

export interface UploadSuccess {
  success: true
  rows: ExcelRow[]
}

export interface UploadError {
  success: false
  error: string
  code?: string
}

export type ApiResponse = UploadSuccess | UploadError

export type ProcessingStatus = 'idle' | 'ready' | 'processing' | 'success' | 'error'
