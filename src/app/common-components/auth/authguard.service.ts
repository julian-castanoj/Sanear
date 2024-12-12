import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AuthguardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('Guard comprobando autenticación:', isAuthenticated);

    if (!isAuthenticated) {
      console.log('No autenticado. Redirigiendo al login.');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('Autenticado. Acceso permitido.');
    return true;
  }
}