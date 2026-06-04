import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
})

export const config = {
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)'],
}
