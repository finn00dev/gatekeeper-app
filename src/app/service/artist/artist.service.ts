import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Functions, httpsCallableData } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(
    private functions: Functions,
    private router: Router
  ) { }

  getTodaysArtist(timezone: string): Observable<string> {
    const getTodaysArtistCallable = httpsCallableData<{timezone: string}, {data: string}>(this.functions, 'getTodaysArtist');
    return getTodaysArtistCallable({timezone}).pipe(
      map((result) => result.data),
      catchError((err) => {
        this.router.navigate(['/error']);
        return of('');
      })
    );
  }

  getTopSongs(artistName: string): Observable<string[]> {
    const getTopSongsCallable = httpsCallableData<{artistName: string}, {data: string[]}>(this.functions, 'getTopSongs');
    return getTopSongsCallable({artistName}).pipe(
      map((result) => result.data),
      catchError((err) => {
        this.router.navigate(['/error']);
        return of([]);
      })
    );
  }
  
  searchSongs(searchTerm: string): Observable<string[]> {
    const searchSongsCallable = httpsCallableData<{searchTerm: string}, {data: string[]}>(this.functions, 'searchSongs');
    return searchSongsCallable({searchTerm}).pipe(
      map((result) => result.data),
      catchError((err) => {
        this.router.navigate(['/error']);
        return of([]);
      })
    );
  }

}
