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
  private apiUrl = 'https://api-jfyc2o6rla-uc.a.run.app/profiles';

  constructor(private http: HttpClient) {}

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl);
  }
}
