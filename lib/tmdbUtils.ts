import Papa from "papaparse";

export type Movie = {
  movie_id: number;
  title: string;
  genre: string;
  posterURL: string;
  overview: string;
};

function fmtResults(data: any): Movie[] {
  let movies: Movie[] = [];
  for (let i = 0; i < data.results.length; i++) {
    movies.push({
      movie_id: data.results[i].id,
      title: data.results[i].title,
      genre: data.results[i].genre_ids[0],
      posterURL:
        "https://image.tmdb.org/t/p/original" + data.results[i].poster_path,
      overview: data.results[i].overview,
    });
  }
  return movies;
}

export async function getNowPlaying(): Promise<Movie[]> {
  const url =
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=" +
      process.env.NEXT_PUBLIC_TMDB_API_KEY || "NOT_SET";
  const options = {
    method: "GET",
  };

  const response = await fetch(url, options);
  return fmtResults(await response.json());
}

export async function IMDBtoTMDB(csv: []): Promise<any> {
  const parsedRatings = [];
  for (let i = 1; i < csv.length; i++) {
    const imdbID = csv[i][0];
    const url = `https://api.themoviedb.org/3/find/${imdbID}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&external_source=imdb_id`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (!data.movie_results.length) {
      continue;
    }
    const movie = {
      movie_id: data.movie_results[0].id,
      title: data.movie_results[0].title,
      genre: data.movie_results[0].genre_ids[0],
      posterURL:
        "https://image.tmdb.org/t/p/original" +
        data.movie_results[0].poster_path,
      rating: csv[i][1],
    };
    parsedRatings.push(movie);
    // sleep for 0.25 seconds
    await new Promise((r) => setTimeout(r, 80));
  }
  return parsedRatings;
}

export async function LetterboxdtoIMDB(csv: []): Promise<any> {
  const parsedRatings = [];
  for (let i = 1; i < 70 && i < csv.length; i++) {
    const title = csv[i][1];
    const year = csv[i][2];
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${title}&year=${year}&include_adult=true&page=1`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (!data.results.length) {
      continue;
    }
    const movie = {
      movie_id: data.results[0].id,
      title: data.results[0].title,
      genre: data.results[0].genre_ids[0],
      posterURL:
        "https://image.tmdb.org/t/p/original" + data.results[0].poster_path,
      rating: (csv[i][4] / 5) * 10,
    };
    parsedRatings.push(movie);
    // sleep for 0.25 seconds
    await new Promise((r) => setTimeout(r, 80));
    console.log("sleeping...");
  }
  return parsedRatings;
}
