"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function HomePage() {
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

  if (location.latitude && location.longitude) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          color: "white",
        }}
      >
        <h1 className="text-4xl font-bold p-10">
          {" "}
          Clubs Near {location.city}, {location.state}
        </h1>
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
