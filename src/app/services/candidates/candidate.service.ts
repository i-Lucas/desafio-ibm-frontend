import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { ApiCandidateResponse } from 'src/app/interfaces/candidate';

interface CandidateBody {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private path = "api/v1/hiring";

  constructor(private http: HttpClient, private apiService: ApiService) { }

  scheduleCandidate(candidateId: string, token: string): Observable<ApiCandidateResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = this.apiService.getApiUrl();
    const url = `${apiUrl}/${this.path}/schedule`;
    return this.http.post<ApiCandidateResponse>(url, { candidateId }, { headers });
  }

  public addCandidate(candidate: CandidateBody, token: string): Observable<ApiCandidateResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = this.apiService.getApiUrl();
    const url = `${apiUrl}/${this.path}/start`;
    return this.http.post<ApiCandidateResponse>(url, candidate, { headers });
  }

  public approveCandidate(candidateId: string, token: string): Observable<ApiCandidateResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = this.apiService.getApiUrl();
    const url = `${apiUrl}/${this.path}/approve`;
    return this.http.post<ApiCandidateResponse>(url, { candidateId }, { headers });
  }

  public disqualifyCandidate(candidateId: string, token: string): Observable<ApiCandidateResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = this.apiService.getApiUrl();
    const url = `${apiUrl}/${this.path}/disqualify`;
    return this.http.post<ApiCandidateResponse>(url, { candidateId }, { headers });
  }

}