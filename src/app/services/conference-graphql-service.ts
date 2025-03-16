import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';

const SESSIONS_ATTRIBUTES = gql`
  fragment SessionInfo on Session {
    id
    title
    startsAt
    day
    room
    level
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

@Injectable({
  providedIn: 'root'
})
export class ConferenceGraphQLService {
  private apollo = inject(Apollo);

  getSessions(day: string) {
    return this.apollo.watchQuery({
      query: gql`
        query sessions($day: String!) {
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
      variables: { day }
    }).valueChanges;
  }

  getAllSessions() {
    return this.apollo.watchQuery({
      query: gql`
        query sessions {
          sessions {
            ...SessionInfo
          }
        }
        ${SESSIONS_ATTRIBUTES}
      `
    }).valueChanges;
  }

  createSession(session: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createSession($session: SessionInput!) {
          createSession(session: $session) {
            ...SessionInfo
          }
        }
        ${SESSIONS_ATTRIBUTES}
      `,
      variables: { session }
    });
  }

  getSpeaker(id: string) {
    return this.apollo.watchQuery({
      query: gql`
        query speaker($id: ID!) {
          speaker(id: $id) {
            ...SpeakerInfo
          }
        }
        ${SPEAKER_ATTRIBUTES}
      `,
      variables: { id }
    }).valueChanges;
  }

  getAllSpeakers() {
    return this.apollo.watchQuery({
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
