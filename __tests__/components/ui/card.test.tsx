import { render, screen } from "@testing-library/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

describe("Card Components", () => {
  it("renders Card with content", () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>,
    )

    expect(screen.getByText("Card Content")).toBeInTheDocument()
  })

  it("renders all Card subcomponents correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <p>Footer content</p>
        </CardFooter>
      </Card>,
    )

    expect(screen.getByText("Card Title")).toBeInTheDocument()
    expect(screen.getByText("Card Description")).toBeInTheDocument()
    expect(screen.getByText("Main content goes here")).toBeInTheDocument()
    expect(screen.getByText("Footer content")).toBeInTheDocument()
  })

  it("applies custom className to Card", () => {
    render(
      <Card className="custom-class">
        <div>Card Content</div>
      </Card>,
    )

    const card = screen.getByText("Card Content").closest("div")
    expect(card).toHaveClass("custom-class")
  })
})
