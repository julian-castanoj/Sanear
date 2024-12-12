import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../common-components/auth/auth.service';
import { NgIf, NgFor } from '@angular/common';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  isAuthenticated: boolean | null = null;
  errorMessage: string | null = null;

  certificados = [
    {
      link: 'https://sanear.net/wp-content/uploads/2024/03/CERTIFICADO-SANEAR-S.A-9001.pdf',
      imageSrc: 'https://sanear.net/wp-content/uploads/2024/10/9001.png'
    },
    {
      link: 'https://sanear.net/wp-content/uploads/2024/03/CERTIFICADO-SANEAR-S.A-14001.pdf',
      imageSrc: 'https://sanear.net/wp-content/uploads/2024/10/14001.png'
    },
    {
      link: 'https://sanear.net/wp-content/uploads/2024/03/CERTIFICADO-SANEAR-S.A-45001.pdf',
      imageSrc: 'https://sanear.net/wp-content/uploads/2024/10/45001.png'
    },
    {
      link: '#',
      imageSrc: 'https://sanear.net/wp-content/uploads/2024/10/iqnet.png'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.authService.setSession(response.token);
        this.router.navigate(['/consolidado']);
      },
      (error) => {
        this.errorMessage = 'Credenciales inválidas. Intenta nuevamente.';
      }
    );
  }
}
