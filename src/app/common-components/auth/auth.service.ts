import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Asegúrate de importar Inject y PLATFORM_ID
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { isPlatformBrowser } from '@angular/common'; // Asegúrate de importar isPlatformBrowser

export interface AuthResponse {
  token: string; 
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // URL del backend.
  private sessionTimeout: any;
  private sessionDuration = 30 * 60 * 1000; // Duración de la sesión: 30 minutos.

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Método para iniciar sesión.
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      map((response) => {
        // Guarda el token en sessionStorage.
        if (response.token) {
          this.startSession(response.token);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Error durante la autenticación:', error);
        return of(false);
      })
    );
  }

  // Método para cerrar sesión.
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('authToken');
      clearTimeout(this.sessionTimeout);
      this.router.navigate(['/login']);
    }
  }

  // Verifica si el usuario está autenticado.
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!sessionStorage.getItem('authToken');
    }
    return false;
  }

  // Método privado para iniciar la sesión.
  private startSession(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('authToken', token); // Almacena el token en sessionStorage.
      this.resetSessionTimeout();
      this.router.navigate(['/consolidado']); // Redirige al usuario al dashboard.
    }
  }

  // Restablece el temporizador de la sesión.
  private resetSessionTimeout() {
    if (isPlatformBrowser(this.platformId)) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = setTimeout(() => {
        this.logout();
      }, this.sessionDuration);
    }
  }
}