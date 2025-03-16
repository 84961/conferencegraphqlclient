import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConferenceGraphQLService } from '../../services/conference-graphql-service';
import { Speaker } from '../models/speaker.interface';

@Component({
  selector: 'app-speaker',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './speaker-item.component.html',
  styleUrls: ['./speaker-item.component.scss']
})
export class SpeakerItemComponent {
  private route = inject(ActivatedRoute);
  private graphQLService = inject(ConferenceGraphQLService);

  loading = signal(true);
  error = signal<any>(null);
  speaker = signal<Speaker | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSpeaker(id);
    }
  }

  private loadSpeaker(id: string) {
    this.loading.set(true);
    this.graphQLService.getSpeaker(id).subscribe({
      next: (result) => {
        this.speaker.set(result.data.speakerById);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading speaker:', err);
        this.error.set(err);
        this.loading.set(false);
      }
    });
  }
}
