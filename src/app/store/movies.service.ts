import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { VariablesService } from '../shared/variables.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/internal/observable/of';
import 'rxjs/add/operator/do'
import { map,tap } from "rxjs/operators";
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
  public dataStore: any = [];
  private ID: number = 0;
  private localStorageData: any = [];

  public validateYear: Boolean = true;
  public titleError: Boolean = false;
  public validatResults: Boolean = true;
  public LoadSpiner: Boolean = false;

  private readonly FavoritesList = new BehaviorSubject<Movie[]>([]);
  readonly Favorites$ = this.FavoritesList.asObservable();
  private favoriteData: any = [];

  
  constructor(private http: HttpClient, private Variables: VariablesService) {}

  
  public getMovies() {
    this.localStorageData = JSON.parse(localStorage.getItem('defaultMovieList'));
    
    if(this.localStorageData){
      this.dataStore = this.localStorageData;
    }else {
      this.http.get(this.Variables._omdbMovies + `${this.Variables._allMovies}` + `${this.Variables._apiKey}`)
                .pipe(tap((data: any) => {
                  this.dataStore.push(...data.Search.map( ({Type,...rest}) => ({...rest,Favorite: false}) ) );
                  for (let i=0;i<this.dataStore.length;i++) {
                    if(this.dataStore[i].Poster == 'N/A') {
                      this.dataStore[i].Poster = this.Variables.noPic;
                    }
                  }
                  localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
                  return this.dataStore;
                }))
                .subscribe();
    }
    // assinging by the next() method to MovieList BehaviorSubject, the data stored in Movies$ Observable (above), recived from the API request
    this.MovieList.next(this.dataStore); 
  }
  


  public Search(item) {
    this.validatResults = true;
    this.LoadSpiner = true;
    let tempList: Movie[] = JSON.parse(localStorage.getItem('defaultMovieList'))

    this.http.get(this.Variables._omdbMovies + `${this.Variables._searchMovies}` + item + `${this.Variables._apiKey}`).subscribe((data: any) => {
      
      if(data.Search == undefined){
        this.validatResults = false;
      }
      else {
        // if (tempList.some(movie => data.includes(movie)))
        for (let i=0;i<data.Search.length;i++) {
          for (let j=0;j<tempList.length;j++) {
            if (data.Search[i].imdbID == tempList[j].imdbID) {
              data.Search[i] = tempList[j];
            }
          }
        }
        
        this.dataStore = [...data.Search.map( ({Type,...rest}) => ({...rest}) )];
        localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
        
        this.LoadSpiner = false;
        this.MovieList.next(this.dataStore);
      }
    });
  }


  public addMovie(movie) {
    this.validateMovieName(movie);

    this.validatYear(movie);
    
    if(!this.titleError && this.validateYear) {  
      this.ID++
      movie = {...movie, imdbID: this.ID, Poster: this.Variables.noPic, Favorite: false}
      
      this.dataStore.push(movie);
      localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
      
      this.MovieList.next(this.dataStore);
    }
  }


  public getPickedMovie(movie) : Observable<any> {
    let tempMovie = this.dataStore.find(item => item.imdbID == movie.imdbID);
    
    if (tempMovie.Favorite !== undefined && tempMovie.Runtime !== undefined) {
      return of(tempMovie);// the of() method turns tempMovie into an Observable

    }else{
      return this.http.get(this.Variables._omdbMovies + `${this.Variables._pickedMovie}` + tempMovie.imdbID + `${this.Variables._apiKey}`)
                      .pipe(
                        map((data: any) => {
                              tempMovie = {...tempMovie,
                                Runtime: data.Runtime,
                                Genre: data.Genre,
                                Director: data.Director
                              }
                              return tempMovie;
                        })
                      );
    } 
  }

  public editMovieList(pickedMovie) {
    for (let i=0;i<this.dataStore.length;i++) {
      
      if(this.dataStore[i].imdbID == pickedMovie.imdbID) {

        this.validateMovieName(pickedMovie);

        this.validatYear(pickedMovie);

        if(!this.titleError && this.validateYear) {
          
          this.dataStore[i] = pickedMovie;
          localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
          
          let tempData = JSON.parse(localStorage.getItem('favoritesList'));
          if(tempData) {
            let index = tempData.findIndex(item => item.imdbID == pickedMovie.imdbID); //can be also written like: tempData.map(x => { return x.VehicleId; }).indexOf(pickedMovie.imdbID);
            tempData[index] = pickedMovie;
            localStorage.setItem('favoritesList',JSON.stringify(tempData));
          }
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

        this.removeFromFavorites(movieID)
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


  public getFavorites() {
    let favoritesStorag = JSON.parse(localStorage.getItem('favoritesList'));

    if(favoritesStorag)
      this.favoriteData = favoritesStorag;

    // assinging by the next() method to FavoritesList BehaviorSubject, the data stored in Favorites$ Observable
    this.FavoritesList.next(this.favoriteData);
  }

  addToFavorites(favoritemovie) {

    for (let i=0; i<this.dataStore.length; i++) {
       
      if (this.dataStore[i].imdbID === favoritemovie.imdbID) {

        this.dataStore[i] = {...this.dataStore[i], Favorite: true};

        let tempData = JSON.parse(localStorage.getItem('defaultMovieList'));
        
        localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
        favoritemovie = this.dataStore[i];
        break;
      }
    };   
    this.MovieList.next(this.dataStore);  
    
    this.favoriteData.push(favoritemovie);
    
    localStorage.setItem('favoritesList',JSON.stringify(this.favoriteData));
    this.FavoritesList.next(this.favoriteData);
  }

  removeFromFavorites(favoriteID) {
    for (let i=0; i<this.favoriteData.length; i++) {
      if (this.favoriteData[i].imdbID == favoriteID) {
        
        this.favoriteData.splice(i,1);
        localStorage.setItem('favoritesList',JSON.stringify(this.favoriteData));
        this.FavoritesList.next(this.favoriteData);

        this.dataStore.forEach((movie,index) => {
        
          if (movie.imdbID === favoriteID)
            this.dataStore[index].Favorite = false;
        });
        localStorage.setItem('defaultMovieList',JSON.stringify(this.dataStore));
        this.MovieList.next(this.dataStore);
      }
    }
  }

}
