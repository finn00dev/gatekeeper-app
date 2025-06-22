import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Artist } from '../../model/artist.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  apiUrl = 'https://ws.audioscrobbler.com/2.0/?method=';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getTopArtists(): Observable<Artist[]> {
    return this.http
      .get<any>(`${this.apiUrl}chart.gettopartists&api_key=${environment.apiKey}&format=json`)
        .pipe(
          map((resp) => resp.artists.artist),
          catchError((err) => {
            this.router.navigate(['/error']);
            return [];
          })
        );
  }

  getTopSongs(artistName: string): Observable<string[]> {
    return this.http
      .get<any>(`${this.apiUrl}artist.gettoptracks&artist=${artistName.replace(' ', "%20")}&api_key=${environment.apiKey}&format=json&limit=250`)
        .pipe(
          map((resp) => {
            const songs = resp.toptracks.track as any[];
            return songs.map((song) => song.name);
          }),
          catchError((err) => {
            this.router.navigate(['/error']);
            return [];
          }),
        );
  }
  
  searchSongs(searchTerm: string): Observable<string[]> {
    return this.http
      .get<any>(`${this.apiUrl}track.search&track=${searchTerm.replace(' ', "%20")}&api_key=${environment.apiKey}&format=json&limit=6`)
        .pipe(
          map((resp) => {
            let songs = resp.results.trackmatches.track;
            return songs.map((song: any) => song.name);
          }),
          catchError((err) => {
            this.router.navigate(['/error']);
            return [];
          }),
        );
  }

}
