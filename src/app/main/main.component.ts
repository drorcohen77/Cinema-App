import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoviesService } from '../store/movies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Movie } from '../shared/movie.model';
import { VariablesService } from '../shared/variables.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  
  private readonly _allMovies$ = this.MovieService.Movies$
  public _movieList: any = []; // when using subscribe() to access to the allMovies$ (above) Observable insted of using async pipe on the *ngFor
 
  public pickedMovie: Movie;
  public errors: any[] = [];

  private modalRef: any;
  private tempMovie: any;  
  private subscription: any;
  


  constructor(public MovieService: MoviesService, private modalService: NgbModal, private Variables: VariablesService) {
    
    // this.MovieService.getMovies();
   }

   ngOnInit() {
     this.Variables.backToMain = true;
     
     // using subscribe() to access to the allMovies$ (above) Observable insted of using async pipe on the *ngFor
     // the subscribe method get's us to the _value property inside the Observable where the data from the API request is stored
     // after we get access to the allMovies$ by subscription, we can manipulate the data (in this case te moveiList array)
 
     this.subscription = this._allMovies$.subscribe(Movie => { 
       this._movieList = Movie;
     });
   }
 
 
   // async openModal(e,movieDetails,movieID) {
   //   await this.MovieService.getPickedMovie(movieID).subscribe(
   //     (Pickedmovie: Movie) => {
   //       if(this.tempMovie != undefined)
   //         this.pickedMovie =this.tempMovie;
   //       else
   //         this.pickedMovie = Pickedmovie;
             
   //     });
   //   this.modalRef = this.modalService.open(movieDetails);
   // }
 
   // closeModal(e) {
   //   this.modalRef.close();
   // }
 
   addFavorite(favoritemovie) {
     this.MovieService.addToFavorites(favoritemovie);
   }
 
   removeFavorite(favoriteID) {
     this.MovieService.removeFromFavorites(favoriteID);
   }
 
   editMovie(movie,content) {
 
     this.pickedMovie = new Movie;
 
     this.MovieService.getPickedMovie(movie).subscribe(
       (Pickedmovie: Movie) => {
         // if(this.tempMovie != undefined)
         //   this.pickedMovie =this.tempMovie;
         // else
           this.pickedMovie = Pickedmovie;
           console.log(this.pickedMovie)
       // },
       // (errorResponse) => {
       //   this.errors = errorResponse.error.errors;
       console.log(this._movieList)
     this.modalRef = this.modalService.open(content);
       }
     );
 
       // this.MovieService.getPickedMovie(movieID);
      
       
     //   await this._allMovies$.subscribe(movies => {
     //     this._movieList = movies;
     //     let PickedMovie = this._movieList.find(movie => movieID == movie.imdbID);
         
     //     if(this.tempMovie != undefined)
     //       this.pickedMovie =this.tempMovie;
     //     else
     //       this.pickedMovie = PickedMovie;
         
     //   },
     //   (errorResponse) => {
     //     this.errors = errorResponse.error.errors;
     //   }
     // );
    
   }
 
   editSubmition() {
     this.MovieService.editMovieList(this.pickedMovie);
 
     if(!this.MovieService.titleError && this.MovieService.validateYear) {
       this.tempMovie = this.pickedMovie;
       this.modalRef.close();
     }
   }
 
 
   deletMovie(movieID,delcontent) {
     for(let i=0;i<this._movieList.length;i++) {
       if(this._movieList[i].imdbID == movieID) {
         this.pickedMovie = this._movieList[i];
       }
     }
     this.modalRef = this.modalService.open(delcontent);
   }
 
   deletSubmition(movieID) {
     this.MovieService.deleteMovie(movieID);
  
     this.modalRef.close();
   }
 
   
 
   ngOnDestroy() : void {
 
     this.subscription.unsubscribe()
   }

}
