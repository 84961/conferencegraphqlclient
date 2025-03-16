import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConfHomeComponent } from './conf-home/conf-home.component';

export const appRoutes: Routes = [
 // { path: '', component: HomeComponent },
 { path: '', component: ConfHomeComponent },
 {
    path: 'conference',
    loadComponent: () => import('./conference/conference.component').then(m => m.ConferenceComponent)
  },
  {
    path: 'conference/sessions',
    loadComponent: () => import('./sessions/sessions.component').then(m => m.SessionsComponent)
  },
  {
    path: 'conference/sessions/new',
    loadComponent: () => import('./sessions/create-session/create-session.component')
    .then(m => m.CreateSessionComponent)
  },
  {
    path: 'conference/speaker/:id',
    loadComponent: () => import('./speakers/speaker-item/speaker-item.component').then(m => m.SpeakerItemComponent)
  },
  {
    path: 'conference/speakers',
    loadComponent: () => import('./speakers/speakers-list.component').then(m => m.SpeakersListComponent)
  },
  // {
  //   path: 'conference/users',
  //   loadComponent: () => import('./components/user/users-list.component').then(m => m.UsersListComponent)
  // },
  // {
  //   path: 'conference/user/:id',
  //   loadComponent: () => import('./components/user/user.component').then(m => m.UserComponent)
  // },
 
 
];
