export type Club = {
  clubID: string;
  name: string;
  description: string;
  location: string;
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
