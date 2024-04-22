"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ClubMenu from "@/components/clubMenu";
import { Club, defaultClubs } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import { db, resetDB } from "@/lib/firebase";
import { query, where } from "firebase/firestore";
const usersRef = collection(db, "users");
import { useGlobalContext } from "../context/authContext";

export default function Clubs() {
  const { data } = useGlobalContext();
  const [clubsList, setClubsList] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    // fetch movies similar to the top 5 rated by the user
    const topfive = data.ratings
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    console.log("topfive:", topfive);

    const similarMovies = async () => {
      for (let i = 0; i < topfive.length; i++) {
        console.log("topfive[i], ", topfive[i]);
        const resp = await fetch(
          `https://api.themoviedb.org/3/movie/${topfive[i].movie_id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );
        const json = await resp.json();
        console.log(json);
      }
    };

    similarMovies();
  }, []);

  // map each club to a similarity score to the user's ratings
  const similarity = (club: Club) => {
    let sim = 0;
    let count = 0;
    for (const movie in club.membersRatings) {
      for (const userMovie in data.ratings) {
        if (movie.title === userMovie.title) {
          count++;
          if (
            Math.abs(club.membersRatings[movie] - data.ratings[userMovie]) < 10
          ) {
            sim += 1;
          } else {
            sim -= 1;
          }
        }
      }
    }
    return sim * count;
  };

  const updateSortBy = async (value: string) => {
    if (value === "size-asc") {
      setClubsList((prev) =>
        prev.sort((a, b) => a.membersIDs.length - b.membersIDs.length)
      );
    } else if (value === "size-desc") {
      setClubsList((prev) =>
        prev.sort((a, b) => b.membersIDs.length - a.membersIDs.length)
      );
    } else if (value === "sim-asc") {
      setClubsList((prev) =>
        // sort clubs by similarity score
        prev.sort((a, b) => similarity(a) - similarity(b))
      );
    } else if (value === "sim-desc") {
      setClubsList((prev) =>
        // sort clubs by similarity score
        prev.sort((a, b) => similarity(b) - similarity(a))
      );
    } else if (value === "newest") {
      setClubsList((prev) =>
        prev.sort(
          (a, b) => Date.parse(b.events[0].date) - Date.parse(a.events[0].date)
        )
      );
    }
    setSortBy(value);
  };

  const [distance, setDistance] = useState("25");
  const updateDistance = async (value: string) => {
    // for (let i = 0; i < clubsList.length; i++) {
    //   const resp = await fetch(
    //     `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.latitude},${location.longitude}&destinations=${clubsList[i].latitude},${clubsList[i].longitude}&key=${process.env.NEXT_PUBLIC_GMAPS_API_KEY}`
    //   );
    //   console.log(await resp.json());
    // setDistance(value);
  };

  const router = useRouter();

  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    city: string;
    state: string;
  }>({ latitude: null, longitude: null, city: "", state: "" });

  useEffect(() => {
    const geocode = async (lat: number, long: number) => {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.NEXT_PUBLIC_GMAPS_API_KEY}`
      );
      return await resp.json();
    };

    const getPosition = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const response = await geocode(
            position.coords.latitude,
            position.coords.longitude
          );
          console.log(response);

          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: response.results[0].address_components[2].long_name,
            state: response.results[0].address_components[4].short_name,
          });
        });
      } else {
        console.log(
          "Geolocation is not supported by this browser, hardcoding Atlanta, GA."
        );
        setLocation({
          latitude: 33.7488,
          longitude: 84.3877,
          city: "Atlanta",
          state: "GA",
        });
      }
    };

    getPosition();
  }, []);

  useEffect(() => {
    const loadDocuments = async () => {
      const querySnapshot = await getDocs(collection(db, "clubs"));
      const docs = new Set();
      querySnapshot.forEach((doc) => {
        docs.add(doc.data());
      });
      let docArray = Array.from(docs);
      setClubsList(docArray as Club[]);
      setFilteredClubs(docArray as Club[]);
    };

    loadDocuments();
  }, []);

  if (location.latitude && location.longitude) {
    console.log(clubsList);
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          color: "white",
        }}
      >
        <h1 className="text-4xl font-bold pt-10 pb-5">
          {" "}
          Clubs Near {location.city}, {location.state}
        </h1>
        <Separator />
        <div className="flex flex-row pt-5 pb-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                style={{
                  color: "white",
                  backgroundColor: "#15181D",
                  marginRight: "10px",
                }}
              >
                Distance
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuRadioGroup
                value={distance}
                onValueChange={updateDistance}
              >
                <DropdownMenuRadioItem value="15">15 mi.</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="25">25 mi.</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="50">50 mi.</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                style={{
                  color: "white",
                  backgroundColor: "#15181D",
                  marginLeft: "10px",
                }}
              >
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={updateSortBy}
              >
                <DropdownMenuRadioItem value="size-asc">
                  Size Asc.
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size-desc">
                  Size Desc.
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sim-asc">
                  Similarity Asc
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sim-desc">
                  Similarity Desc.
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="newest">
                  Newest
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            style={{
              color: "white",
              backgroundColor: "#15181D",
              marginLeft: "auto",
            }}
            onClick={() => {
              resetDB();
            }}
          >
            Reset DB
          </Button>
          <Button
            variant="outline"
            style={{
              color: "white",
              backgroundColor: "#15181D",
              marginLeft: "auto",
            }}
            onClick={() => router.push("/clubs/create")}
          >
            Create
          </Button>
        </div>
        <Separator />
        <div
          style={{
            overflow: "hidden",
            maxHeight: "100%",
            height: "100%",
          }}
        >
          {clubsList.length > 0 ? (
            <ClubMenu clubs={filteredClubs} />
          ) : (
            <ClubMenu clubs={defaultClubs} />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", "text-white", "m-20")}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
  }
}
