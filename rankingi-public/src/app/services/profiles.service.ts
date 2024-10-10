import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Profile {
  id?: string;
  _id?: string; // Include _id if you want to handle MongoDB document IDs
  name: string;
  address?: string;
  telephone?: string;
  email?: string;
  rank?: number;
  image?: string;
  description?: string;
  specialization?: string;
  geolocation?: string;
  stars?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  // private apiBaseUrl = 'https://api-jfyc2o6rla-uc.a.run.app/profiles';
  private apiBaseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProfiles(type: string): Observable<Profile[]> {
    const apiUrl = `${this.apiBaseUrl}/${type}`; // Dynamic URL based on type
    return this.http.get<Profile[]>(apiUrl);
  }
}
