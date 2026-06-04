import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['nl', 'en'] as const
export const defaultLocale = 'nl'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  if (!locales.includes(locale as 'nl' | 'en')) notFound()
  const messages = locale === 'en'
    ? (await import('@/messages/en.json')).default
    : (await import('@/messages/nl.json')).default
  return {
    locale: locale as string,
    messages,
  }
})
