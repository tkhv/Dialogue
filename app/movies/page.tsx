"use client";
import MovieMenu from "../../components/movieMenu";
import { Input } from "../../components/ui/input";
import { useRouter } from "next/navigation";

export default function MoviePage() {
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get("title") as string;
    console.log("searching for " + title);
    router.push(`/movies/${title}`);
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
      <h1 className="text-4xl font-bold text-center mt-8">In Theatres</h1>
      <MovieMenu />
      <h1 className="text font-bold text-center mt-5">
        Or, search for movies:
      </h1>
      <form onSubmit={submit} style={{ maxWidth: "50vw", width: "50vw" }}>
        <Input
          placeholder="Search for movies"
          name="title"
          id="title"
          style={{ maxWidth: "50wv", marginTop: "10px", color: "black" }}
        />
      </form>
    </div>
  );
}
