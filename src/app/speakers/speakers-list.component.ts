import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConferenceGraphQLService } from '../services/conference-graphql-service';

@Component({
  selector: 'app-speakers-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: `./speakers-list.component.html`,
  styleUrls: [`./speakers-list.component.scss`]
})
export class SpeakersListComponent {
  private graphQLService = inject(ConferenceGraphQLService);
  
  loading = signal(true);
  error = signal<any>(null);
  speakers = signal<any[]>([]);

  constructor() {
    this.loadSpeakers();
  }

  private loadSpeakers() {
    this.graphQLService.getAllSpeakers().subscribe({
      next: (result: any) => {
        this.speakers.set(result.data.speakers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err);
        this.loading.set(false);
      }
    });
  }
}
