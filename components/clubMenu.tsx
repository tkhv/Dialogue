import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Club } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function ClubMenu({ clubs }: { clubs: any[] }) {
  const router = useRouter();

  return (
    <Card
      style={{
        maxHeight: "75vh",
        backgroundColor: "#16181D",
        color: "white",
        border: "none",
        overflow: "scroll",
      }}
    >
      <CardContent>
        <Table>
          <TableBody>
            {clubs.map((club: Club) => (
              <TableRow
                key={club.clubID}
                onClick={() => router.push(`/clubs/${club.clubID}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Thumbnail"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={club.thumbnail}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{club.name}</TableCell>
                <TableCell className="font-medium">
                  {club.description.length > 75
                    ? club.description.substring(0, 75) + "..."
                    : club.description}
                </TableCell>
                <TableCell className="font-medium">
                  {club.membersIDs.length} members
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
