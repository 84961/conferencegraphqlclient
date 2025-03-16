export interface Session {
  id: string;
  title: string;
  track: string;  // changed from abstract
  day: string;
  level: string;
  room: string;
  startsAt: string;
  speakers: Speaker[];
}

export interface Speaker {
  id: string;
  name: string;
  bio: string;
}
