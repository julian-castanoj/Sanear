import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';


import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf
  ],
  templateUrl: './app.personel.component.html',
  styleUrl: './app.personel.component.css'
})
export class AppPersonnelComponent {


}