import { Component, OnInit  } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../common-components/auth/auth.service';
import { LoginComponent } from '../common-components/login/login.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consolidated-fortnight',
  standalone: true,
  imports: [NgIf, NgFor, LoginComponent, FormsModule ], 
  templateUrl: './consolidated-fortnight.component.html',
  styleUrls: ['./consolidated-fortnight.component.css']
})

export class ConsolidatedFortnightComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout(); // Llama a la función de logout
  }
}