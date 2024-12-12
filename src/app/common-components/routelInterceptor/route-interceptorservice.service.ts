import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteInterceptorserviceService {

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/login') {
          sessionStorage.removeItem('token'); // Limpia el token al ir a login
        }
      }
    });
  }
}