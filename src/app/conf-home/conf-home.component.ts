import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-conf-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './conf-home.component.html',
  styleUrls: ['./conf-home.component.scss']
})
export class ConfHomeComponent {}
