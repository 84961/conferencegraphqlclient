import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-conference',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']    
})
export class ConferenceComponent {}
