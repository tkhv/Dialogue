import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  doc,
  deleteDoc,
  query,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { User, Club } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { searchTMDB } from "@/lib/tmdbUtils";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: "project-cs4365",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "32382892349",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const imageStorage = getStorage(app);
export const db = getFirestore(app);

export async function resetDB() {
  const harshaUserID = uuidv4();
  const bobUserID = uuidv4();
  const aliceUserID = uuidv4();
  const clubIDs = [];
  for (let i = 0; i < 3; i++) {
    clubIDs.push(uuidv4());
  }

  const sampleClubs: Club[] = [
    {
      clubID: clubIDs[0],
      creatorID: harshaUserID,
      name: "Amateur Screenwriters Club",
      blurb: "Aspiring screenwriters Club",
      description:
        "We are a group of aspiring screenwriters who meet to review movies, or share our work for feedback.",
      location: "Atlanta, GA",
      latitude: 33.7488,
      longitude: 84.3877,
      thumbnail:
        "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/48319/article_full%401x.png",
      membersIDs: [harshaUserID, bobUserID, aliceUserID],
      membersRatings: [],
      genres: [],
      events: [
        {
          clubID: clubIDs[0],
          clubName: "Amateur Screenwriters Club",
          eventID: uuidv4(),
          name: "Inspo Night",
          description:
            "Join us for a night of inspiration and creativity! We will have a guest speaker and a short-film screening. Stick around for a discussions and drinks afterwards.",
          date: "2024-3-21",
          time: "19:00",
          location: "261 19th St NW #1250, Atlanta, GA 30363",
          coordinates: [33.7915, 84.3895],
          virtual: false,
          hasMovie: false,
          movie: {},
          attendeNames: ["Harsha Thottempudi", "Bob Smith", "Jane Doe"],
        },
        {
          clubID: clubIDs[0],
          clubName: "Amateur Screenwriters Club",
          eventID: uuidv4(),
          name: "Historical Fiction Review",
          description:
            "We will be watching Schindler's List! Join us for a discussion and drinks afterwards.",
          date: "2024-4-25",
          time: "19:00",
          location: "261 19th St NW #1250, Atlanta, GA 30363",
          coordinates: [33.7915, 84.3895],
          virtual: false,
          hasMovie: true,
          movie: await searchTMDB("Schindler's List"),
          attendeNames: ["Harsha Thottempudi", "Bob Smith"],
        },
        {
          clubID: clubIDs[0],
          clubName: "Amateur Screenwriters Club",
          eventID: uuidv4(),
          name: "Sci-Fi Screenwriting",
          description:
            "May the 4th be with you! We will be watching Star Wars: A New Hope and discussing the screenplay.",
          date: "2024-5-4",
          time: "19:00",
          location: "261 19th St NW #1250, Atlanta, GA 30363",
          coordinates: [33.7915, 84.3895],
          virtual: false,
          hasMovie: true,
          movie: await searchTMDB("Star Wars: A New Hope"),
          attendeNames: [
            "Harsha Thottempudi",
            "Bob Smith",
            "Alice Wonderland",
            "John Doe",
            "Jane Doe",
            "Tenor Smith",
          ],
        },
      ],
    },
    {
      clubID: clubIDs[1],
      creatorID: bobUserID,
      name: "Alpharetta Film Club",
      blurb: "For casual film buffs!",
      description:
        "For movie lovers that like to socialize over movies! We usually meet at a local theater, but occasionally have virtual movie nights.",
      location: "Alpharetta, GA",
      latitude: 34.0754,
      longitude: 84.2941,
      thumbnail:
        "https://ncte.org/wp-content/uploads/2020/01/iStock-182677992-1-movie-watching.jpg",
      membersIDs: [bobUserID, aliceUserID],
      membersRatings: [],
      genres: [],
      events: [
        {
          clubID: clubIDs[1],
          clubName: "Atlanta Movie Buffs",
          eventID: uuidv4(),
          name: "Movie Night",
          description:
            "Join us for a movie night! We will be watching The Godfather.",
          date: "2024-3-21",
          time: "19:00",
          location: "261 19th St NW #1250, Atlanta, GA 30363",
          coordinates: [34.0754, 84.2941],
          virtual: false,
          hasMovie: true,
          movie: await searchTMDB("The Godfather"),
          attendeNames: ["Bob Smith", "Alice Wonderland", "Jane Doe"],
        },
        {
          clubID: clubIDs[1],
          clubName: "Atlanta Movie Buffs",
          eventID: uuidv4(),
          name: "Dune 2!",
          description:
            "This is a Dune: Part Two viewing party! Join us for a discussion and drinks afterwards.",
          date: "2024-4-25",
          time: "19:00",
          location: "261 19th St NW #1250, Atlanta, GA 30363",
          coordinates: [33.7915, 84.3895],
          virtual: false,
          hasMovie: true,
          movie: await searchTMDB("Dune: Part Two"),
          attendeNames: ["Bob Smith", "Alice Wonderland"],
        },
      ],
    },
    {
      clubID: clubIDs[2],
      creatorID: aliceUserID,
      name: "Animators Society",
      blurb: "For a love of animation!",
      description:
        "Calling all animators and enthusiasts! We usually meet at a local theater, but occasionally have virtual movie nights.",
      location: "Atlanta, GA",
      latitude: 33.7488,
      longitude: 84.3877,
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRkgIKJoGsdCMMP_DywbQNVQ3-nGUfsTAjBRVSjQ6bIg&s",
      membersIDs: [aliceUserID, bobUserID, harshaUserID],
      membersRatings: [],
      genres: [],
      events: [
        {
          clubID: clubIDs[2],
          clubName: "Atlanta Movie Buffs",
          eventID: uuidv4(),
          name: "Movie Night",
          description:
            "Join us for a movie night! We will be watching The Godfather.",
          date: "2024-3-21",
          time: "19:00",
          location: "261 19th St NW #1250, Atlanta, GA 30363",
          coordinates: [33.7915, 84.3895],
          virtual: false,
          hasMovie: true,
          movie: await searchTMDB("The Godfather"),
          attendeNames: ["Alice Wonderland", "Bob Smith", "Jane Doe"],
        },
        {
          clubID: clubIDs[2],
          clubName: "Atlanta Movie Buffs",
          eventID: uuidv4(),
          name: "Dune 2!",
          description:
            "This is a Dune: Part Two viewing party! Join us for a discussion and drinks afterwards.",
          date: "2024-4-25",
          time: "19:00",
          location: "261 19th St NW #1250, Atlanta, GA 30363",
          coordinates: [33.7915, 84.3895],
          virtual: false,
          hasMovie: true,
          movie: await searchTMDB("Dune: Part Two"),
          attendeNames: ["Alice Wonderland", "Bob Smith"],
        },
      ],
    },
  ];

  const sampleUsers: User[] = [
    {
      email: "harsha@gmail.com",
      fname: "Harsha",
      lname: "Thottempudi",
      password: "asd",
      ratings: [],
      userID: harshaUserID,
      memberOf: [sampleClubs[0], sampleClubs[1]],
    },
    {
      email: "bob@gmail.com",
      fname: "Bob",
      lname: "Smith",
      password: "asd",
      ratings: [],
      userID: bobUserID,
      memberOf: [sampleClubs[0], sampleClubs[1], sampleClubs[2]],
    },
    {
      email: "alice@gmail.com",
      fname: "Alice",
      lname: "Wonderland",
      password: "asd",
      ratings: [],
      userID: aliceUserID,
      memberOf: [sampleClubs[0], sampleClubs[1], sampleClubs[2]],
    },
  ];

  for (let i = 0; i < sampleUsers.length; i++) {
    const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${
      i + 1
    }&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (!data.results.length) {
      continue;
    }
    for (let j = 0; j < data.results.length; j++) {
      const movie = {
        movie_id: data.results[j].id,
        title: data.results[j].title,
        genre: data.results[j].genre_ids[0],
        posterURL:
          "https://image.tmdb.org/t/p/original" + data.results[j].poster_path,
        rating: data.results[j].vote_average,
      };
      sampleUsers[i].ratings.push(movie);
      for (const club of sampleUsers[i].memberOf) {
        club.membersRatings.push(movie);
      }
    }
  }

  // Get all clubs and delete them
  const clubsQuery = query(collection(db, "clubs"));
  const clubsSnapshot = await getDocs(clubsQuery);
  clubsSnapshot.forEach((doc) => deleteDoc(doc.ref));

  // Get all users and delete them
  const usersQuery = query(collection(db, "users"));
  const usersSnapshot = await getDocs(usersQuery);
  usersSnapshot.forEach((doc) => deleteDoc(doc.ref));

  // Save the sample users
  for (const user of sampleUsers) {
    await setDoc(doc(db, "users", user.userID), user);
  }

  // Save the sample clubs
  for (const club of sampleClubs) {
    await setDoc(doc(db, "clubs", club.clubID), club);
  }
}
