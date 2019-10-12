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
  private dataStore: any = [];
  private ID: number = 0;
  private localStorageData: any = [];

  public validateYear: Boolean = true;
  public titleError: Boolean = false;
  public validatResults: Boolean = true;


  private readonly FavoritesList = new BehaviorSubject<Movie[]>([]);
  readonly Favorites$ = this.FavoritesList.asObservable();
  private favoriteData: Array<any> = [];

  
  constructor(private http: HttpClient, private Variables: VariablesService) {}

  
  public getMovies() {
    this.localStorageData = JSON.parse(localStorage.getItem('defaultMovieList'));
 
    if(this.localStorageData){
      this.dataStore = this.localStorageData;
    }else {
      this.http.get(this.Variables._omdbMovies + `${this.Variables._allMovies}` + `${this.Variables._apiKey}`).subscribe((data: any) => {
       
        this.dataStore.push(...data.Search.map( ({Type,...rest}) => ({...rest}) ) );
        for (let i=0;i<this.dataStore.length;i++) {
          if(this.dataStore[i].Poster == 'N/A') 
            this.dataStore[i].Poster = this.Variables.noPic;
        }
        localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
      });
    }
    // assinging by the next() method to MovieList BehaviorSubject, the data stored in Movies$ Observable (above), recived from the API request
    this.MovieList.next(this.dataStore); 
  }
  


  public Search(item) {
    this.validatResults = true;

    this.http.get(this.Variables._omdbMovies + `${this.Variables._searchMovies}` + item + `${this.Variables._apiKey}`).subscribe((data: any) => {
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
      movie = {...movie, imdbID: this.ID, Poster: this.Variables.noPic}

      this.dataStore.push(movie);
      localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
      this.MovieList.next(this.dataStore);
    }
  }

  
  // public getPickedMovie(movieId) {
  //   this.http.get(this.Variables._omdbMovies + `${this.Variables._pickedMovie}` + movieId + `${this.Variables._apiKey}`).subscribe((data: any) => {
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
    return this.http.get(this.Variables._omdbMovies + `${this.Variables._pickedMovie}` + movieId + `${this.Variables._apiKey}`);
  }


  public editMovieList(pickedMovie) {
    for (let i=0;i<this.dataStore.length;i++) {
      
      if(this.dataStore[i].imdbID == pickedMovie.imdbID) {

        this.validateMovieName(pickedMovie);

        this.validatYear(pickedMovie);

        if(!this.titleError && this.validateYear) {
          this.dataStore[i] = pickedMovie;
          localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
          this.MovieList.next(this.dataStore);
        }
      }
    }
  }


  public deleteMovie(movieID) {
    for(let i=0;i<this.dataStore.length;i++) {
      if(this.dataStore[i].imdbID == movieID) {
        this.dataStore.splice(i,1);
        localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
        this.MovieList.next(this.dataStore);
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



  addToFavorites(favoritemovie) {
    this.dataStore.forEach((movie,index) => {
        
      if (movie.imdbID === favoritemovie.imdbID) 
        this.dataStore[index] = {...this.dataStore[index], Favorite: true};
    });   
    this.MovieList.next(this.dataStore);      

    this.favoriteData.push(favoritemovie);
    localStorage.setItem('favoritesList',JSON.stringify(this.favoriteData));
    this.FavoritesList.next(this.favoriteData);
  }

  removeFromFavorites(favoriteID) {
    for (let i=0; i<this.favoriteData.length; i++) {
      if (this.favoriteData[i].imdbID == favoriteID) {
        
        this.favoriteData.splice(i,1);
        this.FavoritesList.next(this.favoriteData);

        this.dataStore.forEach((movie,index) => {
        
          if (movie.imdbID === favoriteID) 
            this.dataStore[index].Favorite = false;
        });
        this.MovieList.next(this.dataStore);
      }
    }
  }
}
