import Link from "next/link";
import { SignupForm } from "./components/signupForm";
import { LoginForm } from "./components/loginForm";

export default function AuthenticationPage() {
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
      <SignupForm />
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="#" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
