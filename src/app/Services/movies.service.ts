import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private omdbMovies = "https://www.omdbapi.com/?";
  private apiKey = "&apikey=6f79e721";
  private allMovies = "s=money&Type=movie&y=2019";
  private searchMovies = "s=";
  private pickedMovie = "i=";

  constructor(private http: HttpClient) { }

  public getMovies() : Observable<any> {
    return this.http.get(this.omdbMovies + `${this.allMovies}` + `${this.apiKey}`);
  }

  public getPickedMovie(movieId) : Observable<any> {
    return this.http.get(this.omdbMovies + `${this.pickedMovie}` + movieId + `${this.apiKey}`)
  }

  public Search(item) : Observable<any> {
    return this.http.get(this.omdbMovies + `${this.searchMovies}` + item + `${this.apiKey}`)
  }

}
