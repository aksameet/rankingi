import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Profile {
  id: string;
  _id?: string; // Include _id if you want to handle MongoDB document IDs
  name: string;
  email: string;
  rank: number;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  // private apiUrl = 'https://api-jfyc2o6rla-uc.a.run.app/profiles';
  private apiUrl = 'https://localhost:3000/profiles';

  constructor(private http: HttpClient) {}

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl);
  }

  createProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.apiUrl, profile);
  }

  updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${profile.id}`, profile);
  }

  deleteProfile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
