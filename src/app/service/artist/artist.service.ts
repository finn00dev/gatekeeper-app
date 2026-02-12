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

  getSuggestions(searchTerm: string): Observable<string[]> {
    const getSuggestionsCallable = httpsCallableData<{searchTerm: string}, {data: string[]}>(this.functions, 'getSuggestions');
    return getSuggestionsCallable({searchTerm}).pipe(
      map((result) => result.data),
      catchError((err) => {
        this.router.navigate(['/error']);
        return of([]);
      })
    );
  }

  checkGuess(artistName: string, songName: string): Observable<boolean> {
    const checkGuessCallable = httpsCallableData<{artistName: string; songName: string}, {data: boolean}>(this.functions, 'checkGuess');
    return checkGuessCallable({artistName, songName}).pipe(
      map((result) => result.data),
      catchError((err) => {
        this.router.navigate(['/error']);
        return of(false);
      })
    );
  }

}
