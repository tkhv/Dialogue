"use client";

import { useGlobalContext } from "@/app/context/authContext";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Autocomplete from "react-google-autocomplete";
import { useState } from "react";
import { searchTMDB } from "@/lib/tmdbUtils";

export default function CreateEventsPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const user = useGlobalContext().data;
  const [location, setLocation] = useState({
    address_components: [],
  } as any) as React.SetStateAction<any>;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const clubRef = doc(db, "clubs", params.slug);
    const docSnap = await getDoc(clubRef);

    const hasMovie = data.get("movie") !== "";
    const movie = hasMovie ? await searchTMDB(data.get("movie") as string) : {};

    const createdEvent = {
      clubID: docSnap.get("clubID") as string,
      clubName: docSnap.get("name") as string,
      eventID: uuidv4(),
      name: data.get("name") as string,
      description: data.get("desc") as string,
      date: data.get("date") as string,
      time: data.get("time") as string,
      location:
        location.address_components[0].long_name +
        ", " +
        location.address_components[2].short_name,
      coordinates: [
        location.geometry.location.lat(),
        location.geometry.location.lng(),
      ],
      virtual: data.get("virtual") === "on",
      hasMovie: hasMovie,
      movie: movie,
      attendeNames: [user.fname + " " + user.lname],
    };

    try {
      const res = await updateDoc(clubRef, {
        events: arrayUnion(createdEvent),
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    router.push("/clubs/" + params.slug + "/events/" + createdEvent.eventID);
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <h1 className="text-4xl font-bold pt-10 pb-5"> Create an event</h1>
      <Separator />
      <div className="flex flex-row pt-10 pb-5" style={{ width: "100%" }}>
        <Card
          style={{
            color: "white",
            backgroundColor: "#16181D",
            border: "0px",
            width: "100%",
          }}
        >
          <CardContent>
            <form onSubmit={submit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="string"
                      placeholder="Schindler's List - Watch party"
                      required
                      style={{ color: "black" }}
                    />
                  </div>
                </div>
                <div
                  className="grid grid-cols-2 gap-4"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Label htmlFor="virtual">Virtual?</Label>
                  <input type="checkbox" id="virtual" name="virtual" />
                  <Autocomplete
                    apiKey={process.env.NEXT_PUBLIC_GMAPS_API_KEY}
                    onPlaceSelected={(place) => {
                      setLocation(place);
                    }}
                    id="location"
                    name="location"
                    style={{ color: "black" }}
                  />

                  <Input
                    type="date"
                    id="date"
                    name="date"
                    required
                    style={{ color: "black", maxWidth: "100%" }}
                  />
                  <Input
                    type="time"
                    id="time"
                    name="time"
                    required
                    style={{ color: "black", maxWidth: "100%" }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    name="desc"
                    placeholder="We will also do dinner later!"
                    required
                    style={{ color: "black" }}
                  />
                </div>
                <Label htmlFor="movie">
                  Movie <i>(optional)</i>
                </Label>
                <Input
                  type="text"
                  id="movie"
                  name="movie"
                  placeholder="Schindler's List"
                  style={{ color: "black" }}
                />
                <div
                  className="grid gap-2"
                  style={{
                    maxWidth: "50%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Label htmlFor="ffa">Open for non-members: </Label>
                  <input type="checkbox" id="ffa" name="ffa" />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  style={{ backgroundColor: "black", marginTop: "10px" }}
                >
                  Create event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
