import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VariablesService } from '../shared/variables.service';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../shared/movie.model';
import { MoviesService } from './movies.service';


@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  // private readonly FavoritesList = new BehaviorSubject<Movie[]>([]);
  // readonly Favorites$ = this.FavoritesList.asObservable();
  // private favoriteData: Array<any> = [];


  constructor(private http: HttpClient, private Variables: VariablesService, private MoviesService: MoviesService) { }


  // addToFavorites(favoritemovie) {
  //   console.log(JSON.parse(localStorage.getItem('defaultMovieList')))
  //   for (let i=0; i<this.MoviesService.dataStore.length; i++) {
       
  //     if (this.MoviesService.dataStore[i].imdbID === favoritemovie.imdbID) {
  //       this.MoviesService.dataStore[i] = {...this.MoviesService.dataStore[i], Favorite: true};
  //       let tempData = JSON.parse(localStorage.getItem('defaultMovieList'));
  //       console.log(tempData)
  //       localStorage.setItem('defaultMovieList',JSON.stringify(this.MoviesService.dataStore));
  //       favoritemovie = this.MoviesService.dataStore[i];
  //       break;
  //     }
  //   };   
  //   this.MoviesService.MovieList.next(this.MoviesService.dataStore);  
    
  //   this.favoriteData.push(favoritemovie);
  //   localStorage.setItem('favoritesList',JSON.stringify(this.favoriteData));
  //   this.FavoritesList.next(this.favoriteData);
  // }

  // removeFromFavorites(favoriteID) {
  //   for (let i=0; i<this.favoriteData.length; i++) {
  //     if (this.favoriteData[i].imdbID == favoriteID) {
        
  //       this.favoriteData.splice(i,1);
  //       localStorage.setItem('favoritesList',JSON.stringify(this.favoriteData));
  //       this.FavoritesList.next(this.favoriteData);

  //       this.MoviesService.dataStore.forEach((movie,index) => {
        
  //         if (movie.imdbID === favoriteID)
  //           this.MoviesService.dataStore[index].Favorite = false;
  //       });
  //       localStorage.setItem('defaultMovieList',JSON.stringify(this.MoviesService.dataStore));
  //       this.MoviesService.MovieList.next(this.MoviesService.dataStore);
  //     }
  //   }
  // }
}
