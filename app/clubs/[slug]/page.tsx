"use client";
import { useGlobalContext } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { Club } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import EventMenu from "@/components/eventMenu";
import { Separator } from "@/components/ui/separator";

export default function ClubPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [club, setClub] = useState<Club>();
  const { data } = useGlobalContext();

  useEffect(() => {
    const loadDocuments = async () => {
      const docRef = doc(db, "clubs", params.slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClub(docSnap.data() as Club);
      }
    };

    loadDocuments();
  }, []);

  if (!club) {
    return <div>Loading...</div>;
  }

  console.log(club);
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          color: "white",
          overflow: "scroll",
          marginBottom: "1%",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <img
            src={club.thumbnail}
            alt="Thumbnail"
            style={{ maxHeight: "350px", marginTop: "5%" }}
          />
        </div>
        <div
          style={{
            width: "60%",
          }}
        >
          <h1 className="text-4xl font-bold mt-10 mb-8">{club.name}</h1>
          <p className="text-lg">📍 {club.location}, </p>
          <p className="text-lg">👥 {club.membersIDs.length} members</p>
          <p className="text-lg mt-6">{club.description}</p>
          {club.creatorID === data.userID && (
            <>
              <Button
                onClick={() => router.push(`/clubs/${club.clubID}/edit`)}
                style={{ marginTop: "10%" }}
              >
                {" "}
                Edit{" "}
              </Button>
              <Button
                onClick={() => router.push(`/clubs/${club.clubID}/events`)}
                style={{ marginTop: "10%", marginLeft: "2%" }}
              >
                {" "}
                Create Event{" "}
              </Button>
            </>
          )}
          {!club.membersIDs.includes(data.userID) && (
            <>
              <Button
                onClick={() => {
                  club.membersIDs.push(data.userID);
                }}
                style={{ marginTop: "10%" }}
              >
                {" "}
                Join{" "}
              </Button>
            </>
          )}
          {club.creatorID != data.userID &&
            club.membersIDs.includes(data.userID) && (
              <>
                <Button
                  onClick={() => {
                    club.membersIDs = club.membersIDs.filter(
                      (id) => id != data.userID
                    );
                  }}
                  style={{ marginTop: "10%" }}
                >
                  {" "}
                  Leave{" "}
                </Button>
              </>
            )}
        </div>
      </div>
      <Separator />
      <EventMenu eventsList={club.events} />
    </>
  );
}
