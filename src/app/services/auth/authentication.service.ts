import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiLoginResponse, UserDetailsResponse } from '../../interfaces/ApiResponse';
import { UserBodyLogin } from '../../interfaces/User';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  signUp(data: UserBodyLogin): Observable<string> {
    return this.http.post(this.apiService.getApiUrl().concat("/auth/signup"), data, { responseType: 'text' });
  }

  signIn(data: UserBodyLogin): Observable<ApiLoginResponse> {
    return this.http.post<ApiLoginResponse>(this.apiService.getApiUrl().concat("/auth/signin"), data, { headers: this.apiService.getHeaders() });
  }

  getUserDetails(token: string): Observable<UserDetailsResponse> {
    const headers = this.apiService.getHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserDetailsResponse>(this.apiService.getApiUrl().concat("/auth/user/details"), { headers });
  }

  getToken() {
    const token = localStorage.getItem('utoken');
    return token !== null ? token : null;
  }

  saveToken(token: string) {
    localStorage.setItem('utoken', token);
  }

  clearToken() {
    localStorage.removeItem('utoken');
  }

}