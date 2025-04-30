/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a password
 * Requirements:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * @param password - The password to validate
 * @returns True if the password is valid, false otherwise
 */
export function validatePassword(password: string): boolean {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

/**
 * Validates a name
 * Requirements:
 * - At least 2 characters
 * - Contains only letters, spaces, hyphens, and apostrophes
 * @param name - The name to validate
 * @returns True if the name is valid, false otherwise
 */
export function validateName(name: string): boolean {
  if (name.length < 2) return false
  const nameRegex = /^[A-Za-z\s'-]+$/
  return nameRegex.test(name)
}

/**
 * Validates a phone number
 * Accepts various formats:
 * - +1234567890
 * - 123-456-7890
 * - (123) 456-7890
 * - 123 456 7890
 * - 1234567890
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  if (phone.length < 10 || phone.length > 20) return false
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,6}$/
  return phoneRegex.test(phone)
}
