import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditPostForm from './EditPostForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()
  return <EditPostForm post={post} />
}
