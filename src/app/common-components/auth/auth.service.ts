import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { isPlatformBrowser } from '@angular/common'; 
import { environment } from '../../../environment/environment';

export interface AuthResponse {
  token: string; 
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  private sessionTimeout: any;
  private sessionDuration = 30 * 60 * 1000; 
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      map((response) => {
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

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('authToken');
      clearTimeout(this.sessionTimeout);
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!sessionStorage.getItem('authToken');
    }
    return false;
  }

  private startSession(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('authToken', token);
      this.resetSessionTimeout();
      this.router.navigate(['/consolidado']); 
    }
  }

  private resetSessionTimeout() {
    if (isPlatformBrowser(this.platformId)) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = setTimeout(() => {
        this.logout();
      }, this.sessionDuration);
    }
  }
}