// src/app/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profile {
  id?: string;
  _id?: string;
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
  opinions?: number;
  website?: string;
  city: string;
  company?: string;
  own_stars?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiBaseUrl = 'http://localhost:3000';
  // private apiBaseUrl = 'https://api-jfyc2o6rla-uc.a.run.app';

  constructor(private http: HttpClient) {}

  getProfiles(type: string, city?: string): Observable<Profile[]> {
    let apiUrl = `${this.apiBaseUrl}/${type}`;
    if (city) {
      apiUrl += `/city/${city}`;
    }
    return this.http.get<Profile[]>(apiUrl);
  }

  getProfilesGroupedByCompany(type: string): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/${type}/companies`;
    return this.http.get<any>(apiUrl);
  }

  createProfile(profile: Profile, type: string): Observable<Profile> {
    const apiUrl = `${this.apiBaseUrl}/${type}`;
    return this.http.post<Profile>(apiUrl, profile);
  }

  updateProfile(profile: Profile, type: string): Observable<Profile> {
    const apiUrl = `${this.apiBaseUrl}/${type}/${profile.id}`;
    return this.http.put<Profile>(apiUrl, profile);
  }

  deleteProfile(id: string, type: string): Observable<void> {
    const apiUrl = `${this.apiBaseUrl}/${type}/${id}`;
    return this.http.delete<void>(apiUrl);
  }

  deleteAll(
    type: string,
    city?: string
  ): Observable<{ message: string; deletedCount?: number }> {
    let apiUrl = `${this.apiBaseUrl}/${type}`;
    if (city) {
      apiUrl += `/city/${city}`;
    }
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
