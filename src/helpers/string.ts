import { REGEX_VALID_EMAIL } from '@/config/regex'

export function isValidEmail(email: string): boolean {
  const emailRegex = REGEX_VALID_EMAIL
  return emailRegex.test(email)
}
