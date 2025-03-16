import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ALL_SESSIONS, ConferenceGraphQLService, SessionInput } from '../../services/conference-graphql-service'; 
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})
export class CreateSessionComponent {
  private fb = inject(FormBuilder);
  private graphQLService = inject(ConferenceGraphQLService);
  private apollo = inject(Apollo);
  
  submitted = signal(false);
  error = signal<any>(null);
  
  sessionForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    day: ['', Validators.required],
    level: ['', Validators.required]
  });

  onSubmit() {
    if (this.sessionForm.valid) {
      this.graphQLService.createSession(this.sessionForm.value as SessionInput).subscribe({
        next: () => {
          this.submitted.set(true);
          // Apollo will automatically refetch the sessions query
          this.apollo.client.refetchQueries({
            include: [ALL_SESSIONS],
            updateCache: (cache) => {
              cache.evict({ fieldName: 'sessions' });
              cache.gc();
            }
          });
        },
        error: (err) => {
          console.error('Error creating session:', err);
          this.error.set(err);
        }
      });
    }
  }
}
