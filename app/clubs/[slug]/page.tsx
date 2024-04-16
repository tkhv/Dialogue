"use client";
import { useGlobalContext } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { Club } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";

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
          backgroundColor: "red",
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
          // height: "95vh",
          width: "60%",
          backgroundColor: "blue",
        }}
      >
        <h1 className="text-4xl font-bold mt-10 mb-8">{club.name}</h1>
        <p className="text-lg">📍 {club.location}, </p>
        <p className="text-lg">👥 {club.memberNames.length} members</p>
        <p className="text-lg mt-6">{club.description}</p>
        {club.creatorID === data.userID && (
          <Button
            onClick={() => router.push(`/clubs/${club.clubID}/edit`)}
            style={{ marginTop: "10%" }}
          >
            {" "}
            Edit{" "}
          </Button>
        )}
      </div>
    </div>
  );
}
