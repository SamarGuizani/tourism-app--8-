import { slugify, truncate, capitalize } from "@/utils/string-utils"

describe("String Utilities", () => {
  describe("slugify", () => {
    it("converts string to slug format", () => {
      expect(slugify("Hello World")).toBe("hello-world")
      expect(slugify("Sidi Bou Said")).toBe("sidi-bou-said")
      expect(slugify("Café & Restaurant")).toBe("cafe-restaurant")
    })

    it("handles special characters and multiple spaces", () => {
      expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces")
      expect(slugify("Special@#$%^&*Characters")).toBe("specialcharacters")
    })

    it("returns empty string for invalid inputs", () => {
      expect(slugify("")).toBe("")
      expect(slugify(null)).toBe("")
      expect(slugify(undefined)).toBe("")
    })
  })

  describe("truncate", () => {
    it("truncates string to specified length", () => {
      expect(truncate("This is a long text", 10)).toBe("This is a...")
      expect(truncate("Short", 10)).toBe("Short")
    })

    it("uses custom suffix when provided", () => {
      expect(truncate("This is a long text", 10, " (more)")).toBe("This is a (more)")
    })

    it("handles edge cases", () => {
      expect(truncate("", 10)).toBe("")
      expect(truncate(null, 10)).toBe("")
      expect(truncate(undefined, 10)).toBe("")
    })
  })

  describe("capitalize", () => {
    it("capitalizes first letter of each word", () => {
      expect(capitalize("hello world")).toBe("Hello World")
      expect(capitalize("sidi bou said")).toBe("Sidi Bou Said")
    })

    it("handles already capitalized text", () => {
      expect(capitalize("Hello World")).toBe("Hello World")
    })

    it("handles edge cases", () => {
      expect(capitalize("")).toBe("")
      expect(capitalize(null)).toBe("")
      expect(capitalize(undefined)).toBe("")
    })
  })
})
