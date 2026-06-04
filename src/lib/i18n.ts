import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['nl', 'en'] as const
export const defaultLocale = 'nl'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  if (!locales.includes(locale as 'nl' | 'en')) notFound()
  return {
    locale: locale as string,
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})
