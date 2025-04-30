import { validateEmail, validatePassword, validateName, validatePhone } from "@/utils/validation"

describe("Validation Utils", () => {
  describe("validateEmail", () => {
    it("should return true for valid emails", () => {
      expect(validateEmail("test@example.com")).toBe(true)
      expect(validateEmail("user.name+tag@example.co.uk")).toBe(true)
      expect(validateEmail("user-name@domain.com")).toBe(true)
    })

    it("should return false for invalid emails", () => {
      expect(validateEmail("")).toBe(false)
      expect(validateEmail("test@")).toBe(false)
      expect(validateEmail("test@domain")).toBe(false)
      expect(validateEmail("test.domain.com")).toBe(false)
      expect(validateEmail("@domain.com")).toBe(false)
    })
  })

  describe("validatePassword", () => {
    it("should return true for valid passwords", () => {
      expect(validatePassword("Password123!")).toBe(true)
      expect(validatePassword("Abcd1234$")).toBe(true)
      expect(validatePassword("P@ssw0rd")).toBe(true)
    })

    it("should return false for invalid passwords", () => {
      expect(validatePassword("")).toBe(false)
      expect(validatePassword("pass")).toBe(false) // Too short
      expect(validatePassword("password")).toBe(false) // No uppercase, no number
      expect(validatePassword("PASSWORD123")).toBe(false) // No lowercase
      expect(validatePassword("Password")).toBe(false) // No number
      expect(validatePassword("password123")).toBe(false) // No uppercase
    })
  })

  describe("validateName", () => {
    it("should return true for valid names", () => {
      expect(validateName("John")).toBe(true)
      expect(validateName("John Doe")).toBe(true)
      expect(validateName("Jean-Claude")).toBe(true)
      expect(validateName("O'Connor")).toBe(true)
    })

    it("should return false for invalid names", () => {
      expect(validateName("")).toBe(false)
      expect(validateName("J")).toBe(false) // Too short
      expect(validateName("John123")).toBe(false) // Contains numbers
      expect(validateName("John@Doe")).toBe(false) // Contains special characters
    })
  })

  describe("validatePhone", () => {
    it("should return true for valid phone numbers", () => {
      expect(validatePhone("+1234567890")).toBe(true)
      expect(validatePhone("123-456-7890")).toBe(true)
      expect(validatePhone("(123) 456-7890")).toBe(true)
      expect(validatePhone("123 456 7890")).toBe(true)
      expect(validatePhone("1234567890")).toBe(true)
    })

    it("should return false for invalid phone numbers", () => {
      expect(validatePhone("")).toBe(false)
      expect(validatePhone("123")).toBe(false) // Too short
      expect(validatePhone("abcdefghij")).toBe(false) // Contains letters
      expect(validatePhone("123-abc-7890")).toBe(false) // Contains letters
      expect(validatePhone("12345678901234567890")).toBe(false) // Too long
    })
  })
})
