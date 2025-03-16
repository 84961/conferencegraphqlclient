import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Session } from '../models/session.interface';

@Component({
  selector: 'app-session-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss']
})
export class SessionItemComponent {
  @Input() session!: Session;
}
