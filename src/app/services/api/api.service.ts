import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  getApiUrl() { 
    console.log("prod ", environment.production);
    return this.apiUrl;
  }

  getHeaders() {
    return this.headers;
  }
}
