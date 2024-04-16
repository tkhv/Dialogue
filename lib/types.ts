export type User = {
  userID: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  memberOf: string[];
  ratings: [];
};

export type Club = {
  clubID: string;
  creatorID: string;
  name: string;
  blurb: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
  memberNames: string[];
  genres: string[];
  events: CreatedEvent[];
};

export type CreatedEvent = {
  clubID: string;
  clubName: string;
  eventID: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  virtual: boolean;
  hasMovie: boolean;
  movie: {};
  coordinates: number[];
  attendeNames: string[];
};

export const defaultClubs: Club[] = [];
