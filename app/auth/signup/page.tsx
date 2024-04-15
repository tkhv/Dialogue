"use client";

import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { IMDBtoTMDB, LetterboxdtoIMDB } from "@/lib/tmdbUtils";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

const usersRef = collection(db, "users");

import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const checkIfExists = async () => {
      const q = query(usersRef, where("email", "==", data.get("email")));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });

      if (!querySnapshot.empty) {
        console.log("User exists");
        router.push(`/auth/signin`);
      } else {
        const user: User = {
          userID: uuidv4(),
          fname: data.get("first-name") as string,
          lname: data.get("last-name") as string,
          email: data.get("email") as string,
          password: data.get("password") as string,
          ratings: [],
        };

        // Get the file from the form data
        const file = data.get("file") as File | null;

        // Print the file
        if (file) {
          let csv: any;
          // Check if the file type is CSV
          if (file.type === "text/csv") {
            // Parse the CSV file
            const parseCSV = (file: File) =>
              new Promise((resolve, reject) => {
                Papa.parse(file, {
                  complete: function (results) {
                    resolve(results.data);
                  },
                  error: function (err) {
                    console.log("Error parsing CSV:", err);
                    reject(err);
                  },
                });
              });
            // Store the parsed CSV in the csv variable
            parseCSV(file)
              .then((data) => {
                if (data[0][0] == "Const") {
                  IMDBtoTMDB(data as []).then((res) => {
                    user.ratings = res;
                    console.log(user);
                    const docRef = doc(db, "users", user.userID);
                    setDoc(docRef, user).then(() => {
                      console.log("Document written with ID: ", user.userID);
                      router.push(`/auth/signin`);
                    });
                  });
                } else {
                  LetterboxdtoIMDB(data as []).then((res) => {
                    user.ratings = res;
                    console.log(user);
                    const docRef = doc(db, "users", user.userID);
                    setDoc(docRef, user).then(() => {
                      console.log("Document written with ID: ", user.userID);
                      router.push(`/auth/signin`);
                    });
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          console.log("No file selected");
        }
      }
    };

    checkIfExists();
    return;
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
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Optionally, import ratings from Letterboxd and IMDb to improve club
            reccomendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    name="first-name"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    name="last-name"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ratings">Import Ratings</Label>
                <Input type="file" name="file" accept=".csv" />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
