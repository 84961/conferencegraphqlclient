import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { Speaker, SpeakerResponse, SpeakersResponse } from '../speakers/models/speaker.interface';
import { Session, SessionResponse, SessionsByDayResponse } from '../sessions/models/session.interface';

const SESSIONS_ATTRIBUTES = gql`
  fragment SessionInfo on Session {
    id
    title
    startsAt
    day
    room
    level
    description @include(if: $isDescription)
    speakers {
      id
      name
    }  
  }
`;

const SPEAKER_ATTRIBUTES = gql`
  fragment SpeakerInfo on Speaker {
    id
    name
    bio
    featured
    sessions {
      id
      title
    }
  }
`;

const USER_ATTRIBUTES = gql`
  fragment UserInfo on User {
    id
    email
    firstName
    lastName
    company
    sessions {
      id
      title
    }
  }
`;

export const ALL_SESSIONS = gql`
  query sessions($isDescription: Boolean = true) {
    sessions {
      ...SessionInfo
    }
  }
  ${SESSIONS_ATTRIBUTES}
`;

export interface SessionInput {
  title: string;
  description: string;
  day: string;
  level: string;
}

export const ALL_SPEAKERS = gql`
  query speakers {
    speakers {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}
`;

@Injectable({
    providedIn: 'root'
})
export class ConferenceGraphQLService {
    private apollo = inject(Apollo);

    markFeatured(speakerId: string, featured: boolean) {
        return this.apollo.mutate({
          mutation: gql`
            mutation markFeatured($speakerId: ID!, $featured: Boolean!) {
              markFeatured(speakerId: $speakerId, featured: $featured) {
                ...SpeakerInfo
              }
            }
            ${SPEAKER_ATTRIBUTES}
          `,
          variables: { speakerId, featured },
          refetchQueries: [{ query: ALL_SPEAKERS }]
        });
      }

    getSessions(day: string, isDescription: boolean = false) {
        return this.apollo.watchQuery<SessionsByDayResponse>({
            query: gql`
        query sessions($day: String!, $isDescription: Boolean!) {
          intro: sessions(day: $day, level: "Introductory and overview") {
            ...SessionInfo
          }
          intermediate: sessions(day: $day, level: "Intermediate") {
            ...SessionInfo
          }
          advanced: sessions(day: $day, level: "Advanced") {
            ...SessionInfo
          }
        }
        ${SESSIONS_ATTRIBUTES}
      `,
            variables: { day, isDescription }
        }).valueChanges;
    }

    getAllSessions(isDescription: boolean = false) {
        return this.apollo.watchQuery<SessionResponse>({
            query: gql`
        query sessions($isDescription: Boolean!) {
          sessions {
            ...SessionInfo
          }
        }
        ${SESSIONS_ATTRIBUTES}
      `,

            variables: { isDescription }
        }).valueChanges;
    }

    createSession(session: SessionInput) {
        return this.apollo.mutate<{createSession: Session}>({
            mutation: gql`
        mutation createSession($session: SessionInput!, $isDescription: Boolean = true) {
          createSession(session: $session) {
            ...SessionInfo
          }
        }
        ${SESSIONS_ATTRIBUTES}
      `,
            variables: { 
                session,
                isDescription: true
            }
        });
    }

    getSpeaker(id: string) {
        return this.apollo.watchQuery<SpeakerResponse>({
            query: gql`
        query speakerById($id: ID!) {
          speakerById(id: $id) { 
            ...SpeakerInfo
          }
        }
        ${SPEAKER_ATTRIBUTES}
      `,
            variables: { id }
        }).valueChanges;
    }

    getAllSpeakers() {
        return this.apollo.watchQuery<SpeakersResponse>({
            query: gql`
        query speakers {
          speakers {
            ...SpeakerInfo
          }
        }
        ${SPEAKER_ATTRIBUTES}
      `
        }).valueChanges;
    }

    getFeaturedSpeakers() {
        return this.apollo.watchQuery({
            query: gql`
        query featuredSpeakers {
          speakers(featured: true) {
            ...SpeakerInfo
          }
        }
        ${SPEAKER_ATTRIBUTES}
      `
        }).valueChanges;
    }

    getUser(id: string) {
        return this.apollo.watchQuery({
            query: gql`
        query user($id: ID!) {
          user(id: $id) {
            ...UserInfo
          }
        }
        ${USER_ATTRIBUTES}
      `,
            variables: { id }
        }).valueChanges;
    }

    getAllUsers() {
        return this.apollo.watchQuery({
            query: gql`
        query users {
          users {
            ...UserInfo
          }
        }
        ${USER_ATTRIBUTES}
      `
        }).valueChanges;
    }
}
