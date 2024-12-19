import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Asegúrate de importar Inject y PLATFORM_ID
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { throwError } from 'rxjs';

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://backsanear.netlify.app';
  private renewTokenInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,

  ) { }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Obtener los encabezados
  getHeaders(): Observable<string[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data) => data[0]),
      catchError((error) => {
        console.error('Error al obtener los encabezados', error);
        return of([]);
      })
    );
  }


  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  

  refreshToken(): Observable<AuthResponse | null> {
    const token = this.getToken();
    if (!token) {
      return of(null); // Retornamos explícitamente un Observable<AuthResponse | null>
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/renew-token`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError((error) => {
        console.error('Error al renovar token', error);
        return of(null); // Retornamos null si falla
      })
    );
  }


  private startTokenRenewal() {
    if (this.renewTokenInterval) {
      clearInterval(this.renewTokenInterval);
    }
    this.renewTokenInterval = setInterval(() => {
      this.refreshToken().subscribe((response) => {
        if (response && response.token) {
          sessionStorage.setItem('token', response.token);
        } else {
          this.logout();
        }
      });
    }, 10 * 60 * 1000); 
  }


  
  logout() {
    console.log('Saliendo, eliminando token de sessionStorage.');
    sessionStorage.removeItem('token');
    clearInterval(this.renewTokenInterval);
    this.router.navigate(['/login']);
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('Verificando autenticación:', token ? 'Token válido' : 'Sin token');
    return !!token;
  }
  
  getToken(): string | null {
    const token = sessionStorage.getItem('token');
    console.log('Obteniendo token de sessionStorage:', token);
    return token;
  }
  

  isLoggedIn(): boolean {
    // Comprueba si el token existe y es válido (puedes agregar lógica adicional)
    return !!sessionStorage.getItem('token');
  }




  setLoginStatus() {
    // Cuando el usuario se autentique con éxito, marcamos que pasó por el login
    sessionStorage.setItem('hasPassedLogin', 'true');
  }

  setSession(token: string) {
    sessionStorage.setItem('token', token);
    this.startTokenRenewal();
  }


}
