import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponseLogin } from '../interfaces/ApiResponse';
import { UserBodyLogin } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private apiUrl = "http://localhost:8080/auth/signin";
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  signIn(data: UserBodyLogin): Observable<ApiResponseLogin> {
    return this.http.post<ApiResponseLogin>(this.apiUrl, data, { headers: this.headers });
  }
}
