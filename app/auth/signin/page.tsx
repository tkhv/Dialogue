import Link from "next/link";
import { SigninForm } from "../components/signinForm";

export default function SigninPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        color: "white",
      }}
    >
      <SigninForm />
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
