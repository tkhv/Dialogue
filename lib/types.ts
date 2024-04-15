export type User = {
  userID: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  ratings: [];
};

export type Club = {
  clubID: string;
  creatorID: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
  memberNames: string[];
  genres: string[];
  events: Event[];
};

export type Event = {
  clubID: string;
  clubName: string;
  eventID: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  thumbnail: string;
  attendeNames: string[];
};

export const defaultClubs: Club[] = [
  {
    clubID: "1",
    creatorID: "1",
    name: "Club 1",
    description: "Description 1",
    location: "Location 1",
    latitude: 0,
    longitude: 0,
    thumbnail: "https://via.placeholder.com/150",
    memberNames: ["Member 1", "Member 2", "Member 3"],
    genres: ["Genre 1", "Genre 2", "Genre 3"],
    events: [],
  },
  {
    clubID: "2",
    creatorID: "2",
    name: "Club 2",
    description: "Description 2",
    location: "Location 2",
    latitude: 0,
    longitude: 0,
    thumbnail: "https://via.placeholder.com/150",
    memberNames: ["Member 1", "Member 2", "Member 3"],
    genres: ["Genre 1", "Genre 2", "Genre 3"],
    events: [],
  },
  {
    clubID: "3",
    creatorID: "2",
    name: "Club 3",
    description: "Description 3",
    location: "Location 3",
    latitude: 0,
    longitude: 0,
    thumbnail: "https://via.placeholder.com/150",
    memberNames: ["Member 1", "Member 2", "Member 3"],
    genres: ["Genre 1", "Genre 2", "Genre 3"],
    events: [],
  },
  {
    clubID: "4",
    creatorID: "2",
    name: "Club 4",
    description: "Description 4",
    location: "Location 4",
    latitude: 0,
    longitude: 0,
    thumbnail: "https://via.placeholder.com/150",
    memberNames: ["Member 1", "Member 2", "Member 3"],
    genres: ["Genre 1", "Genre 2", "Genre 3"],
    events: [],
  },
  {
    clubID: "5",
    creatorID: "2",
    name: "Club 5",
    description: "Description 5",
    location: "Location 5",
    latitude: 0,
    longitude: 0,
    thumbnail: "https://via.placeholder.com/150",
    memberNames: ["Member 1", "Member 2", "Member 3"],
    genres: ["Genre 1", "Genre 2", "Genre 3"],
    events: [],
  },
];
