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
import { collection, doc, getDocs } from "firebase/firestore";
import { db, resetDB } from "@/lib/firebase";
import { query, where } from "firebase/firestore";
const usersRef = collection(db, "users");
import { useGlobalContext } from "../context/authContext";
import EventMenu from "@/components/eventMenu";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useMap } from "@vis.gl/react-google-maps";

export default function EventsPage() {
  const { data } = useGlobalContext();
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const map = useMap();
  const geometryLib = useMapsLibrary("geometry");
  const [sphericalService, setSphericalService] = useState(null);
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    city: string;
    state: string;
  }>({ latitude: null, longitude: null, city: "", state: "" });

  function distanceBetweenUser(lat1: number, lon1: number) {
    if (!geometryLib || !map || !eventsList) return;
    console.log("HERE");
    const res = geometryLib.spherical.computeDistanceBetween(
      { lat: lat1, lng: lon1 },
      { lat: location.latitude!, lng: location.longitude! }
    );
    return res as number;
  }

  const updateSortBy = async (value: string) => {
    if (value === "size-asc") {
      setEventsList((prev) =>
        prev.sort((a, b) => a.attendeNames.length - b.attendeNames.length)
      );
    } else if (value === "size-desc") {
      setEventsList((prev) =>
        prev.sort((a, b) => b.attendeNames.length - a.attendeNames.length)
      );
    } else if (value === "newest") {
      setEventsList((prev) =>
        prev.sort(
          (a, b) => Date.parse(b.events[0].date) - Date.parse(a.events[0].date)
        )
      );
    } else if (value === "dist-asc") {
      console.log("HIT");
      setEventsList((prev) =>
        prev.sort(
          (a, b) =>
            // distanceBetweenUser(a.latitude, a.longitude)! -
            // distanceBetweenUser(b.latitude, b.longitude)!
            a.coordinates[0] - b.coordinates[0]
        )
      );
    } else if (value === "dist-desc") {
      setEventsList((prev) =>
        prev.sort(
          (a, b) =>
            // distanceBetweenUser(b.latitude, b.longitude)! -
            // distanceBetweenUser(a.latitude, a.longitude)!
            a.coordinates[1] - b.coordinates[1]
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

  useEffect(() => {
    // const geocode = async (lat: number, long: number) => {
    //   const resp = await fetch(
    //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.NEXT_PUBLIC_GMAPS_API_KEY}`
    //   );
    //   return await resp.json();
    // };

    // const getPosition = async () => {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(async (position) => {
    //       const response = await geocode(
    //         position.coords.latitude,
    //         position.coords.longitude
    //       );
    //       console.log(response);

    //       setLocation({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //         city: response.results[0].address_components[2].long_name,
    //         state: response.results[0].address_components[4].short_name,
    //       });
    //     });
    //   } else {
    console.log(
      "Geolocation is not supported by this browser, hardcoding Atlanta, GA."
    );
    setLocation({
      latitude: 33.7488,
      longitude: 84.3877,
      city: "Atlanta",
      state: "GA",
    });
    // }
    // };

    // getPosition();
  }, []);

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
      console.log(eventsArray);

      setEventsList(eventsArray as Club[]);
      setFilteredEvents(eventsArray as Club[]);
    };

    loadDocuments();
  }, []);

  if (location.latitude && location.longitude) {
    console.log(eventsList);
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
          Events Near {location.city}, {location.state}
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
                  Attendees Asc.
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size-desc">
                  Attendees Desc.
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dist-asc">
                  Distance Asc
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dist-desc">
                  Distance Desc.
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
        </div>
        <Separator />
        <div
          style={{
            overflow: "hidden",
            maxHeight: "100%",
            height: "100%",
          }}
        >
          {eventsList.length > 0 ? (
            <EventMenu eventsList={filteredEvents} />
          ) : (
            <EventMenu eventsList={[]} />
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
