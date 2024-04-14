import MovieMenu from "../../components/movieMenu";

export default function MoviePage() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <h1 className="text-4xl font-bold text-center mt-8">Now Playing</h1>
      <MovieMenu />
    </div>
  );
}
