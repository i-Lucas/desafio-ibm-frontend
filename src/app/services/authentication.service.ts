import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiLoginResponse, UserDetailsResponse } from '../interfaces/ApiResponse';
import { UserBodyLogin } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private apiUrl = "http://localhost:8080/auth";
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  signIn(data: UserBodyLogin): Observable<ApiLoginResponse> {
    return this.http.post<ApiLoginResponse>(this.apiUrl.concat("/signin"), data, { headers: this.headers });
  }

  getUserDetails(token: string): Observable<UserDetailsResponse> {
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    console.log(this.headers)
    return this.http.get<UserDetailsResponse>(this.apiUrl.concat("/user/details"), { headers: this.headers });
  }

  getToken() {
    const token = localStorage.getItem('utoken');
    return token !== null ? token : null;
  }

  saveToken(token: string) {
    localStorage.setItem('utoken', token);
  }
}