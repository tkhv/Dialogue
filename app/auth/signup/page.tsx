"use client";

import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { IMDBtoTMDB, LetterboxdtoIMDB } from "@/lib/tmdbUtils";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const usersRef = collection(db, "users");

import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

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
          memberOf: [],
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
                  IMDBtoTMDB(data as [], setProgress).then((res) => {
                    user.ratings = res;
                    console.log(user);
                    const docRef = doc(db, "users", user.userID);
                    setDoc(docRef, user).then(() => {
                      console.log("Document written with ID: ", user.userID);
                      router.push(`/auth/signin`);
                    });
                  });
                } else {
                  LetterboxdtoIMDB(data as [], setProgress).then((res) => {
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

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <CardDescription>
                      Optionally, import your ratings from Letterboxd or IMDb to
                      improve club reccomendations.{" "}
                      <u style={{ cursor: "pointer" }}>See how.</u>{" "}
                    </CardDescription>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Import Ratings</AlertDialogTitle>
                      <Separator style={{ height: "2px" }} />
                      <AlertDialogDescription>
                        <p>Importing from Letterboxd:</p>
                        <ul>
                          <li>
                            • Log into your{" "}
                            <a
                              href="https://letterboxd.com/settings/data/"
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              data settings.
                            </a>{" "}
                          </li>
                          <li>• Click “Export” </li>
                          <li>• Upload the CSV here </li>
                        </ul>
                        <br />
                        <p>Importing from IMDb:</p>
                        <ul>
                          <li>
                            • On{" "}
                            <a
                              href="https://www.imdb.com/?ref_=nv_home"
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              IMDb
                            </a>
                            , go to “Your Ratings” from the user menu (top
                            right)
                          </li>
                          <li>
                            • Click the three vertical dots at top right, then
                            select “Export”{" "}
                          </li>
                          <li>• Upload the CSV here </li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Input type="file" name="file" accept=".csv" />
              </div>
              {progress == 0 ? (
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled>
                  Create an account
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        {progress > 0 ? (
          <CardFooter>
            <Progress value={progress} className="w-[100%]" />
          </CardFooter>
        ) : (
          <></>
        )}
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
