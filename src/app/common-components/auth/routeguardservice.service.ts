import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class RouteGuardService {
  private protectedRoutes = ['/consolidado']; // Define tus rutas protegidas

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const isProtectedRoute = this.protectedRoutes.some((route) => event.url.startsWith(route));

        if (!isProtectedRoute) {
          console.log('Navegando fuera de ruta protegida, eliminando token.');
          sessionStorage.removeItem('token'); // Elimina el token aquí
        }
      }
    });
  }
}