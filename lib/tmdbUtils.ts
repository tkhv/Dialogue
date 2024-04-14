export type Movie = {
  movie_id: number;
  title: string;
  genre: string;
  posterURL: string;
  overview: string;
};

function fmtResults(data: any): Movie[] {
  let movies: Movie[] = [];
  console.log(data);
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
  console.log(process.env.NEXT_PUBLIC_TMDB_API_KEY);
  const url =
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=" +
      process.env.NEXT_PUBLIC_TMDB_API_KEY || "NOT_SET";
  const options = {
    method: "GET",
  };

  const response = await fetch(url, options);
  return fmtResults(await response.json());
}
