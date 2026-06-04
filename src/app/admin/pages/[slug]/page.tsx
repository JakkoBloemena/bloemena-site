import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageEditor from './PageEditor'

const pageTitles: Record<string, string> = {
  'over-mij':          'Over mij',
  'tentoonstellingen': 'Tentoonstellingen',
  'publicaties':       'Publicaties',
  'projecten':         'Projecten',
  'collecties':        'Collecties',
  'recensies':         'Recensies',
  'op-zn-plek':        "Op z'n plek",
  'schilderlessen':    'Schilderlessen',
}

export default async function AdminPageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!pageTitles[slug]) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data } = await supabase.from('pages').select('*').eq('slug', slug).single()

  return (
    <PageEditor
      slug={slug}
      title={pageTitles[slug]}
      initialNl={data?.content_nl ?? ''}
      initialEn={data?.content_en ?? ''}
    />
  )
}
