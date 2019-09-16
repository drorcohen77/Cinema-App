import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private omdbMovies = "http://www.omdbapi.com/?s=money&apikey=6f79e721"

  constructor(private http: HttpClient) { }

  public getMovies() : Observable<any> {
    return this.http.get(this.omdbMovies);
  }

}
