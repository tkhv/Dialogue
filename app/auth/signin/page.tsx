"use client";

import { useGlobalContext } from "@/app/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const usersRef = collection(db, "users");

export default function SigninPage() {
  const router = useRouter();
  const { setData, setIsLoggedIn } = useGlobalContext();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("email"));
    console.log(data.get("password"));

    const checkIfExists = async () => {
      const q = query(usersRef, where("email", "==", data.get("email")));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data().password === data.get("password")) {
          console.log("User exists");

          setIsLoggedIn(true);
          setData({
            userID: doc.data().userID,
            fname: doc.data().fname,
            lname: doc.data().lname,
            email: doc.data().email,
            ratings: doc.data().ratings,
          });

          router.push("/home");
          return;
        } else {
          console.log("Incorrect password");
        }
      });
    };

    checkIfExists();
  }

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
      <Card className="mx-auto max-w-sm" style={{ width: "100vw" }}>
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  name="email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign in to your account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
