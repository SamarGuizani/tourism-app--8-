import { formatDate } from "@/utils/format-date"

describe("formatDate Utility", () => {
  it("formats date in the default format", () => {
    const date = new Date("2023-05-15T12:00:00Z")
    expect(formatDate(date)).toBe("May 15, 2023")
  })

  it("formats date with custom format", () => {
    const date = new Date("2023-05-15T12:00:00Z")
    expect(formatDate(date, { month: "short", day: "numeric", year: "numeric" })).toBe("May 15, 2023")
    expect(formatDate(date, { month: "long", day: "numeric", year: "numeric" })).toBe("May 15, 2023")
    expect(formatDate(date, { month: "numeric", day: "numeric", year: "numeric" })).toBe("5/15/2023")
  })

  it("handles invalid dates", () => {
    expect(formatDate(null)).toBe("")
    expect(formatDate(undefined)).toBe("")
    expect(formatDate(new Date("invalid date"))).toBe("")
  })
})
