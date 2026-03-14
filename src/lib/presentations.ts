import { supabase } from './supabase'

export interface Presentation {
  id: string
  title: string
  description: string | null
  category: 'pitch' | 'roadmap' | 'team' | 'investor-update' | 'financial' | 'partner'
  file_path: string
  file_size_mb: number | null
  file_type: string | null
  uploaded_by: string | null
  created_at: string
  updated_at: string
  tags: string[]
  version: number
  is_public: boolean
  download_count: number
}

export const PRES_CATEGORIES = [
  { value: 'pitch',            label: 'Pitch',           color: '#063D3E', bg: 'rgba(6,61,62,0.10)'   },
  { value: 'roadmap',          label: 'Roadmap',         color: '#D4662A', bg: 'rgba(212,102,42,0.10)' },
  { value: 'team',             label: 'Team',            color: '#5856D6', bg: 'rgba(88,86,214,0.10)'  },
  { value: 'investor-update',  label: 'Investor-Update', color: '#007AFF', bg: 'rgba(0,122,255,0.10)'  },
  { value: 'financial',        label: 'Finanzen',        color: '#34C759', bg: 'rgba(52,199,89,0.10)'  },
  { value: 'partner',          label: 'Partner',         color: '#FF9500', bg: 'rgba(255,149,0,0.10)'  },
] as const

export const ALLOWED_EXTENSIONS = ['pdf', 'pptx', 'ppt', 'key', 'png', 'jpg', 'jpeg', 'gif', 'docx', 'doc', 'xlsx', 'xls', 'csv', 'mp4', 'mov', 'zip']
export const MAX_FILE_SIZE_MB   = 500
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export function validateFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return `Dateityp ".${ext}" nicht erlaubt. Erlaubt: ${ALLOWED_EXTENSIONS.join(', ')}`
  if (file.size > MAX_FILE_SIZE_BYTES)
    return `Zu groß: ${(file.size / 1024 / 1024).toFixed(1)} MB / Max ${MAX_FILE_SIZE_MB} MB`
  if (file.size === 0)
    return 'Datei ist leer.'
  return null
}

export function getContentType(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    pdf:  'application/pdf',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt:  'application/vnd.ms-powerpoint',
    key:  'application/x-iwork-keynote-sffkey',
    png:  'image/png',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    gif:  'image/gif',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc:  'application/msword',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls:  'application/vnd.ms-excel',
    csv:  'text/csv',
    mp4:  'video/mp4',
    mov:  'video/quicktime',
    zip:  'application/zip',
  }
  return map[ext] ?? 'application/octet-stream'
}

export function getCategoryMeta(category: string) {
  return PRES_CATEGORIES.find(c => c.value === category) ?? PRES_CATEGORIES[0]
}

export function getFileTypeBadge(filePath: string): { label: string; color: string } {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf')              return { label: 'PDF',  color: '#FF3B30' }
  if (['pptx','ppt'].includes(ext)) return { label: 'PPT',  color: '#FF9500' }
  if (['png','jpg','jpeg','gif'].includes(ext)) return { label: 'IMG',  color: '#007AFF' }
  if (['docx','doc'].includes(ext))           return { label: 'DOC',  color: '#2563EB' }
  if (['xlsx','xls','csv'].includes(ext))     return { label: 'XLS',  color: '#16A34A' }
  if (['mp4','mov'].includes(ext))            return { label: 'VID',  color: '#8B5CF6' }
  if (ext === 'key')                          return { label: 'KEY',  color: '#FF9500' }
  if (ext === 'zip')                          return { label: 'ZIP',  color: '#8E8E93' }
  return { label: 'FILE', color: '#8E8E93' }
}

export async function getSignedUrl(filePath: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from('presentations')
    .createSignedUrl(filePath, 3600)
  return data?.signedUrl ?? null
}

export async function deletePresentationFile(id: string, filePath: string): Promise<void> {
  const { error: storageErr } = await supabase.storage
    .from('presentations')
    .remove([filePath])
  if (storageErr) throw new Error(`Storage: ${storageErr.message}`)

  const { error: dbErr } = await supabase
    .from('presentations')
    .delete()
    .eq('id', id)
  if (dbErr) throw new Error(`DB: ${dbErr.message}`)
}

export async function togglePublicFlag(id: string, isPublic: boolean): Promise<void> {
  const { error } = await supabase
    .from('presentations')
    .update({ is_public: isPublic, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function trackDownload(id: string): Promise<void> {
  await supabase.rpc('increment_download_count', { pres_id: id })
}
