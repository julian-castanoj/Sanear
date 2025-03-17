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
  private googleSheetUrl = 'https://sheet.best/api/sheets/f0fcc516-53be-4c4f-824d-c0bbcb02fffb/tabs/festivos';
  private sessionTimeout: any; 
  private sessionDuration = 30 * 60 * 1000; 

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  getHeaders(): Observable<string[]> {
    return this.http.get<any[]>(this.googleSheetUrl).pipe(
      map((data) => data[0]),
      catchError((error) => {
        console.error('Error al obtener los encabezados', error);
        return of([]);
      })
    );
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(this.googleSheetUrl).pipe(
      map((data) => {
        const userRow = data.find(
          (row) => row['USUARIOS']?.trim() === username && row['CONTRASEÑAS']?.trim() === password
        );
        if (userRow) {
          this.startSession(); 
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Error durante la autenticación', error);
        return of(false);
      })
    );
  }

  private startSession() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('authenticated', 'true');
      this.resetSessionTimeout();
      this.router.navigate(['/consolidado']); 
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('authenticated');
      clearTimeout(this.sessionTimeout);
      this.router.navigate(['/login']);
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

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('authenticated') === 'true';
    }
    return false; 
  }
}
