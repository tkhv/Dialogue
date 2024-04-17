"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Separator } from "@/components/ui/separator";
import ClubMenu from "@/components/clubMenu";
import { useGlobalContext } from "@/app/context/authContext";
import EventMenu from "@/components/eventMenu";

export default function Home() {
  const { data } = useGlobalContext();

  const eventsList = [];
  for (let club of data.memberOf) {
    if (club.events) {
      for (let event of club.events) {
        const date = new Date(event.date);
        if (date > new Date()) {
          eventsList.push(event);
        }
      }
    }
  }
  console.log(eventsList);

  console.log(data.memberOf);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <h1 className="text-4xl font-bold pt-10"> Hello {data.fname}!</h1>
      <p className="text-lg pb-5" style={{ color: "grey" }}>
        {" "}
        Here's all you need to catch up with your clubs and events.{" "}
      </p>
      <Separator />

      <div
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <Tabs
          defaultValue="account"
          className="w-[100%]"
          style={{ backgroundColor: "#16181D" }}
        >
          <TabsList
            className="grid w-full grid-cols-2"
            style={{ backgroundColor: "#16181D" }}
          >
            <TabsTrigger value="account">Clubs</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card style={{ backgroundColor: "#16181D", border: "none" }}>
              <CardContent className="space-y-2">
                <ClubMenu clubs={data.memberOf} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events">
            <Card style={{ backgroundColor: "#16181D", border: "none" }}>
              <CardContent className="space-y-2">
                <EventMenu eventsList={eventsList} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
