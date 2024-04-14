"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getNowPlaying, Movie } from "@/lib/tmdbUtils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function MovieMenu() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const nowPlayingMovies = await getNowPlaying();
      setMovies(nowPlayingMovies.slice(0, 10));
    };

    fetchMovies();
  }, []);

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border my-10">
      <div className="flex w-max space-x-4 p-4 ">
        {movies.map((movie) => (
          <figure key={movie.title} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <Image
                src={movie.posterURL}
                alt={`Poster for ${movie.title}`}
                className="aspect-[3/4] h-fit w-fit object-cover max-w-[300px] max-h-[260px]"
                width={300}
                height={400}
              />
            </div>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
