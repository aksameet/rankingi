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
  specjalisation?: string;
  geolocation?: string;
  stars?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiBaseUrl = 'http://localhost:3000'; // Base URL

  constructor(private http: HttpClient) {}

  getProfiles(type: string): Observable<Profile[]> {
    const apiUrl = `${this.apiBaseUrl}/${type}`; // Dynamic URL based on type
    return this.http.get<Profile[]>(apiUrl);
  }

  createProfile(profile: Profile, type: string): Observable<Profile> {
    const apiUrl = `${this.apiBaseUrl}/${type}`; // Dynamic URL based on type
    return this.http.post<Profile>(apiUrl, profile);
  }

  updateProfile(profile: Profile, type: string): Observable<Profile> {
    const apiUrl = `${this.apiBaseUrl}/${type}/${profile.id}`; // Dynamic URL based on type
    return this.http.put<Profile>(apiUrl, profile);
  }

  deleteProfile(id: string, type: string): Observable<void> {
    const apiUrl = `${this.apiBaseUrl}/${type}/${id}`; // Dynamic URL based on type
    return this.http.delete<void>(apiUrl);
  }

  deleteAll(
    type: string
  ): Observable<{ message: string; deletedCount?: number }> {
    const apiUrl = `${this.apiBaseUrl}/${type}`;
    return this.http.delete<{ message: string; deletedCount?: number }>(apiUrl);
  }

  createProfiles(
    payload: { profiles: Profile[] },
    type: string
  ): Observable<Profile[]> {
    const apiUrl = `${this.apiBaseUrl}/${type}/bulk`;
    return this.http.post<Profile[]>(apiUrl, payload);
  }
}
