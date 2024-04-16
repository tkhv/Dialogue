"use client";

import { useGlobalContext } from "@/app/context/authContext";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { imageStorage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Club } from "@/lib/types";

export default function EditPage({ params }: { params: { slug: string } }) {
  const [club, setClub] = useState<Club>();
  const [docRef, setDocRef] = useState<any>();

  useEffect(() => {
    const loadDocuments = async () => {
      const docRef = doc(db, "clubs", params.slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClub(docSnap.data() as Club);
        setDocRef(docRef);
      }
    };

    loadDocuments();
  }, []);

  const router = useRouter();
  const user = useGlobalContext().data;
  const [location, setLocation] = useState({
    address_components: [],
  } as any) as React.SetStateAction<any>;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let thumbnailURL = club ? club.thumbnail : "";
    if (data.get("thumbnail")) {
      const imgRef = ref(imageStorage, `thumbnails/${club ? club.clubID : ""}`);
      await uploadBytes(imgRef, data.get("thumbnail") as Blob);
      thumbnailURL = await getDownloadURL(imgRef);
    }

    await setDoc(docRef, {
      clubID: club ? club.clubID : "",
      creatorID: club ? club.creatorID : "",
      name: data.get("name") as string,
      blurb: data.get("blurb") as string,
      description: data.get("desc") as string,
      location: club ? club.location : "",
      latitude: club ? club.latitude : 0,
      longitude: club ? club.longitude : 0,
      thumbnail: thumbnailURL,
      memberNames: club ? club.memberNames : [],
      genres: club ? club.genres : [],
      events: club ? club.events : [],
    });
    router.push(club ? club.clubID : "");
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
      <h1 className="text-4xl font-bold pt-10 pb-5"> Edit club details</h1>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="string"
                      placeholder={club?.name}
                      required
                      style={{ color: "black" }}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="blurb">A short blurb</Label>
                  <Input
                    id="blurb"
                    name="blurb"
                    placeholder={club?.blurb}
                    style={{ color: "black" }}
                    maxLength={100}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    name="desc"
                    placeholder={club?.description}
                    style={{ color: "black" }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">Group Thumbnail</Label>
                  <Input
                    name="thumbnail"
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    style={{ color: "black" }}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  style={{ backgroundColor: "black", marginTop: "10px" }}
                >
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
