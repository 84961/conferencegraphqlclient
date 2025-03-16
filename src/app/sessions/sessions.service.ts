import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Session } from './models/session.interface';
import { Observable, map, tap } from 'rxjs';
import { GET_SESSIONS, GET_SESSIONS_BY_DAY } from './graphql/sessions.queries';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  constructor(private apollo: Apollo) {}

  getSessions(): Observable<Session[]> {
    return this.apollo.watchQuery<{ sessions: Session[] }>({
      query: GET_SESSIONS,
      //fetchPolicy: 'network-only', // Force network request to debug
    }).valueChanges.pipe(
      tap(result => {
        console.log('Response:', result);
        if (result.error) {
          console.error('GraphQL Error:', result.error);
        }
      }),
      map(result => result.data?.sessions || [])
    );
  }

  getSessionsByDay(day: string): Observable<Session[]> {
    return this.apollo.watchQuery<{ sessions: Session[] }>({
      query: GET_SESSIONS_BY_DAY,
      variables: { day },
      //fetchPolicy: 'network-only', // Force network request to debug
    }).valueChanges.pipe(
      tap(result => {
        console.log('Response for day:', day, result);
        if (result.error) {
          console.error('GraphQL Error:', result.error);
        }
      }),
      map(result => result.data?.sessions || [])
    );
  }

  clearCache() {
    this.apollo.client.resetStore();
  }

  isCacheValid(day?: string): boolean {
    try {
      const cacheData = this.apollo.client.cache.readQuery({
        query: day ? GET_SESSIONS_BY_DAY : GET_SESSIONS,
        variables: day ? { day } : undefined
      });
      return !!cacheData;
    } catch {
      return false;
    }
  }

  refreshCache() {
    return this.apollo.client.refetchQueries({
      include: ['GetSessions', 'GetSessionsByDay']
    });
  }
}
