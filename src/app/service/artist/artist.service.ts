import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Artist } from '../../model/artist.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  apiUrl = 'https://ws.audioscrobbler.com/2.0/?method=';

  constructor(private http: HttpClient) { }

  getTopArtists(): Observable<Artist[]> {
    return this.http
      .get<any>(`${this.apiUrl}chart.gettopartists&api_key=${environment.apiKey}&format=json`)
        .pipe(
          map((resp) => resp.artists.artist)
        );
  }

  getTopSongs(artistName: string): Observable<string[]> {
    return this.http
      .get<any>(`${this.apiUrl}artist.gettoptracks&artist=${artistName.replace(' ', "%20")}&api_key=${environment.apiKey}&format=json&limit=150`)
        .pipe(
          map((resp) => {
            const songs = resp.toptracks.track as any[];
            return songs.map((song) => song.name);
          }),
        );
  }
//method=track.search&track=Bound&api_key=c7fdd729c180d175c4d780d323c2f1b9&format=json

  searchSongs(searchTerm: string): Observable<string[]> {
    return this.http
      .get<any>(`${this.apiUrl}track.search&track=${searchTerm.replace(' ', "%20")}&api_key=${environment.apiKey}&format=json&limit=6`)
        .pipe(
          map((resp) => {
            console.log(resp);
            let songs = resp.results.trackmatches.track;
            return songs.map((song: any) => song.name);
          }),
        );
  }

}
