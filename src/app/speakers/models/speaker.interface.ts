export interface Speaker {
  id: string;
  name: string;
  bio: string;
  featured: boolean;
  sessions: {
    id: string;
    title: string;
  }[];
}

export interface SpeakerResponse {
  speakerById: Speaker;
}

export interface SpeakersResponse {
  speakers: Speaker[];
}
