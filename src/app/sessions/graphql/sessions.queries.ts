import { gql } from 'apollo-angular';

export const GET_SESSIONS = gql`
  query GetSessions {
    sessions {
      id
      title
      track
      day
      level
      room
      startsAt
      speakers {
        id
        name
        bio
      }
    }
  }
`;

export const GET_SESSIONS_BY_DAY = gql`
  query GetSessionsByDay($day: String!) {
    sessions(day: $day) {
      id
      title
      track
      day
      level
      room
      startsAt
      speakers {
        id
        name
        bio
      }
    }
  }
`;
