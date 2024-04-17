"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { searchTMDBMulti } from "@/lib/tmdbUtils";
import EventMenu from "@/components/eventMenu";
import { Separator } from "@/components/ui/separator";

export default function ResultsPage({ params }: { params: { slug: string } }) {
  const [results, setResults] = useState<any>();

  useEffect(() => {
    const loadDocuments = async () => {
      const querySnapshot = await getDocs(collection(db, "clubs"));
      const docs = new Set();
      querySnapshot.forEach((doc) => {
        docs.add(doc.data());
      });
      let docArray = Array.from(docs);
      let eventsArray = [];
      for (let i = 0; i < docArray.length; i++) {
        for (let j = 0; j < docArray[i].events.length; j++) {
          eventsArray.push(docArray[i].events[j]);
        }
      }

      let tmdbRes = await searchTMDBMulti(params.slug);
      let resArray = [];
      for (let i = 0; i < tmdbRes.length; i++) {
        for (let j = 0; j < eventsArray.length; j++) {
          if (tmdbRes[i] === eventsArray[j].movie.movie_id) {
            resArray.push(eventsArray[j]);
          }
        }
      }
      setResults(resArray);
      console.log(resArray);
    };

    loadDocuments();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get("title") as string;
    console.log("searching for " + title);
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
      }}
    >
      <h1 className="text-3xl font-bold text-center mt-8 mb-8">
        You searched for: {decodeURIComponent(params.slug)}
      </h1>
      <Separator />
      {results && results.length > 0 ? (
        <EventMenu eventsList={results} />
      ) : (
        <h1 className="text font-bold text-center mt-5">
          No events found - try hosting one!
        </h1>
      )}
    </div>
  );
}
