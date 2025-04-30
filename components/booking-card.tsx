import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type BookingCardProps = {
  booking: {
    id: string
    date: Date
    status: string
    guide: {
      name: string
      expertise: string
    }
    city: {
      name: string
    }
  }
}

export default function BookingCard({ booking }: BookingCardProps) {
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const statusColor =
    {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    }[booking.status.toLowerCase()] || "bg-gray-100 text-gray-800"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{booking.city.name} Tour</CardTitle>
          <Badge className={statusColor}>{booking.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Guide:</span>
            <span className="text-sm">{booking.guide.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Expertise:</span>
            <span className="text-sm">{booking.guide.expertise}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Date:</span>
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
