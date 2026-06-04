import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditArticleForm from './EditArticleForm'

export default async function EditArticlePage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: article } = await supabase.from('articles').select('*').eq('id', id).single()
  if (!article) notFound()

  return <EditArticleForm article={article} />
}
