import { useGlobalContext } from "./context/authContext";
import { Separator } from "@/components/ui/separator";

export default function Dialogue() {
  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          backgroundImage:
            "radial-gradient(circle at center, rgba(21, 24, 29, 0) 0%, rgba(21, 24, 29, 1) 90%), url('https://a.ltrbxd.com/resized/sm/upload/r4/0u/oq/0i/interstellar-1920-1920-1080-1080-crop-000000.jpg')",
          height: "486px",
          width: "864px",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <Separator />
      <h1 className="text-4xl font-bold mt-5 mb-5" style={{ color: "white" }}>
        {" "}
        Welcome to Dialogue!{" "}
      </h1>
      <Separator />
      <p className="text-lg mt-5" style={{ color: "grey" }}>
        {" "}
        Dialogue is a social platform for movie lovers to connect and discuss
        their favorite movies with others.{" "}
      </p>
      <p className="text-lg" style={{ color: "grey" }}>
        {" "}
        Join a club to meet other movie lovers and attend events!{" "}
      </p>
      <p className="text-lg" style={{ color: "grey" }}>
        {" "}
        Get started by signing up or logging in!{" "}
      </p>
    </>
  );
}
