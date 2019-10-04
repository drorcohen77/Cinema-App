import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { VariablesService } from '../shared/variables.service';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'
import * as moment from 'moment';
import { Movie } from '../shared/movie.model';



interface Movies {
  Search: any;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {


  private readonly MovieList = new BehaviorSubject<Movies[]>([]);
  readonly Movies$ = this.MovieList.asObservable(); // assinging to Movies the BehaviorSubject MovieList and as an Observable
  private dataStore = [];
  private ID: number = 0;

  public validateYear: Boolean = true;
  public titleError: Boolean = false;
  public validatResults: Boolean = true;

  
  constructor(private http: HttpClient, private apiVariables: VariablesService) { }

  
  public getMovies() {

    this.http.get(this.apiVariables._omdbMovies + `${this.apiVariables._allMovies}` + `${this.apiVariables._apiKey}`).subscribe((data: any) => {

      this.dataStore.push(...data.Search.map( ({Type,...rest}) => ({...rest}) ) );

      // assinging by the next() method to MovieList BehaviorSubject, the data stored in Movies$ Observable (above), recived from the API request
      this.MovieList.next(this.dataStore); 
    });
  }


  public Search(item) {
    this.validatResults = true;

    this.http.get(this.apiVariables._omdbMovies + `${this.apiVariables._searchMovies}` + item + `${this.apiVariables._apiKey}`).subscribe((data: any) => {
      if(data.Search == undefined)
        this.validatResults = false;
      else {
        this.dataStore = [...data.Search.map( ({Type,...rest}) => ({...rest}) )] ;
        this.MovieList.next(this.dataStore);
      }
    });
  }


  public addMovie(movie) {
    this.validateMovieName(movie);

    this.validatYear(movie);
    
    if(!this.titleError && this.validateYear) {  
      this.ID++
      movie = {...movie, imdbID: this.ID, Poster: this.apiVariables.noPic}

      this.dataStore.push(movie);
      this.MovieList.next(this.dataStore);
    }
  }

  
  // public getPickedMovie(movieId) {
  //   this.http.get(this.apiVariables._omdbMovies + `${this.apiVariables._pickedMovie}` + movieId + `${this.apiVariables._apiKey}`).subscribe((data: any) => {
  //     console.log( data)
  //     console.log( this.dataStore)
      
  //     let PickedMovie
  //     console.log( PickedMovie)
  //       if(this.tempMovie != undefined)
  //         this.pickedMovie =this.tempMovie;
  //       else
  //         this.pickedMovie = PickedMovie;
  //     this.dataStore.forEach((movie,index) => {
        
  //       if (movie.imdbID === data.imdbID) {
  //         this.dataStore[index] = {...this.dataStore[index],
  //           Runtime: data.Runtime,
  //           Genre: data.Genre,
  //           Director: data.Director
  //         }
  //         PickedMovie = this.dataStore[index];
  //       }
  //     });
  //     this.MovieList.next(this.dataStore);
  //     console.log(PickedMovie)
  //  });
  // }
  public getPickedMovie(movieId) : Observable<any> {
    return this.http.get(this.apiVariables._omdbMovies + `${this.apiVariables._pickedMovie}` + movieId + `${this.apiVariables._apiKey}`);
  }


  public editMovieList(pickedMovie) {
    for (let i=0;i<this.dataStore.length;i++) {
      
      if(this.dataStore[i].imdbID == pickedMovie.imdbID) {

        this.validateMovieName(pickedMovie);

        this.validatYear(pickedMovie);

        if(!this.titleError && this.validateYear) {
          this.dataStore[i] = pickedMovie;
          this.MovieList.next(this.dataStore);
        }
      }
    }
  }


  public deleteMovie(movieID) {
    for(let i=0;i<this.dataStore.length;i++) {
      if(this.dataStore[i].imdbID == movieID) {
        this.dataStore.splice(i,1);
      }
    }
  }


  private validateMovieName(pickedMovie) {
    this.titleError = false;
    this.dataStore.forEach((movie) =>{
      if(movie.Title.toLowerCase() == pickedMovie.Title.toLowerCase() && movie.imdbID != pickedMovie.imdbID){
        this.titleError = true;
        }
      });
  }


  private validatYear(pickedMovie) {
    this.validateYear = true;
    let thisYear = new Date;

    if(!moment(pickedMovie.Year,'YYYY',true).isValid())
      this.validateYear = false;
  }

}
