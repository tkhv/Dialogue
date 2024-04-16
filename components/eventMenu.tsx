import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function EventMenu({ eventsList }: { eventsList: any[] }) {
  const router = useRouter();

  return (
    <Card
      style={{
        maxHeight: "75vh",
        backgroundColor: "#16181D",
        color: "white",
        border: "none",
        overflow: "scroll",
        marginTop: "1rem",
      }}
    >
      <CardContent>
        <Table>
          <TableBody>
            {eventsList.map((createdEvent: any) => (
              <TableRow
                key={createdEvent.eventID}
                onClick={() =>
                  router.push(
                    `/clubs/${createdEvent.clubID}/events/${createdEvent.eventID}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Thumbnail"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={createdEvent.movie.posterURL}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {createdEvent.name}
                </TableCell>
                <TableCell className="font-medium">
                  {createdEvent.description.length > 75
                    ? createdEvent.description.substring(0, 75) + "..."
                    : createdEvent.description}
                </TableCell>
                <TableCell className="font-medium" style={{ width: "15%" }}>
                  {createdEvent.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
