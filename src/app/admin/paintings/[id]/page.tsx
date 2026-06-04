import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditPaintingForm from './EditPaintingForm'

export default async function EditPaintingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: painting } = await supabase.from('paintings').select('*').eq('id', id).single()
  if (!painting) notFound()

  return <EditPaintingForm painting={painting} />
}
