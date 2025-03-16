import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConferenceGraphQLService } from '../services/conference-graphql-service'
import { SessionItemComponent } from './session-item/session-item.component';
import { Session, SessionResponse, SessionsByDayResponse } from './models/session.interface';


@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, RouterLink, SessionItemComponent],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  private graphQLService = inject(ConferenceGraphQLService);

  selectedDay = signal<string>('All');
  loading = signal(true);
  error = signal<any>(null);
  sessions = signal<Session[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.loadSessions();
  }

  setDay(day: string) {
    this.selectedDay.set(day);
    this.loadSessions();
  }

  private loadSessions() {
    this.loading.set(true);
    this.error.set(null); // Reset error state

    if (this.selectedDay() === 'All') {
      this.graphQLService.getAllSessions().subscribe({
        next: (result) => {
          this.sessions.set(result.data.sessions);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error in component:', err);
          this.error.set(err);
          this.loading.set(false);
        }
      });
    } else {
      this.graphQLService.getSessions(this.selectedDay()).subscribe({
        next: (result) => {
          const allSessions = [
            ...result.data.intro,
            ...result.data.intermediate,
            ...result.data.advanced
          ];
          this.sessions.set(allSessions);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error in component:', err);
          this.error.set(err);
          this.loading.set(false);
        }
      });
    }
  }

  introSessions() {
    return this.sessions().filter(session => 
      session.day === this.selectedDay() && session.level === 'Introductory and overview');
  }

  intermediateSessions() {
    return this.sessions().filter(session => 
      session.day === this.selectedDay() && session.level === 'Intermediate');
  }

  advancedSessions() {
    return this.sessions().filter(session => 
      session.day === this.selectedDay() && session.level === 'Advanced');
  }
}
