"use client";
import { useGlobalContext } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { Club } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { create } from "domain";

export default function EventPage({
  params,
}: {
  params: { slug: string; eventSlug: string };
}) {
  const router = useRouter();
  const [createdEvent, setEvent] = useState<any>();
  const { data } = useGlobalContext();
  console.log(createdEvent);
  useEffect(() => {
    const loadDocuments = async () => {
      const docRef = doc(db, "clubs", params.slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvent(
          docSnap.data().events.find((e: any) => e.eventID === params.eventSlug)
        );
      }
    };

    loadDocuments();
  }, []);

  if (!createdEvent) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        color: "white",
        overflow: "scroll",
      }}
    >
      <div
        style={{
          // height: "95vh",
          width: "100%",
          // backgroundColor: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <img
          src={createdEvent.movie.posterURL || `https://imgur.com/uNUpmEC.png`}
          alt="Thumbnail"
          style={{ maxHeight: "350px", marginTop: "5%" }}
        />
      </div>
      <div
        style={{
          // height: "95vh",
          width: "60%",
          // backgroundColor: "blue",
        }}
      >
        <h1 className="text-4xl font-bold mt-10 mb-8">{createdEvent.name}</h1>
        <p className="text-lg">📍 {createdEvent.location}, </p>
        <p className="text-lg">
          👥 {createdEvent.attendeNames.length} attendees
        </p>
        <p className="text-lg">
          Hosted by{" "}
          <u>
            <a
              onClick={() => router.push(`/clubs/${createdEvent.clubID}`)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              {createdEvent.clubName}{" "}
            </a>
          </u>
        </p>
        <p className="text-lg mt-6">{createdEvent.description}</p>
        {!createdEvent.attendeNames.includes(data.fname + " " + data.lname) ? (
          <>
            <Button
              onClick={() => {
                setEvent((prevEvent) => ({
                  ...prevEvent,
                  attendeNames: [
                    ...prevEvent.attendeNames,
                    data.fname + " " + data.lname,
                  ],
                }));
              }}
              style={{ marginTop: "10%" }}
            >
              Attend
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                setEvent((prevEvent) => ({
                  ...prevEvent,
                  attendeNames: prevEvent.attendeNames.filter(
                    (name) => name !== data.fname + " " + data.lname
                  ),
                }));
              }}
              style={{ marginTop: "10%" }}
            >
              Leave
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
