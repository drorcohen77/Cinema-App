import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoviesService } from '../../store/movies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Movie } from '../../shared/movie.model';
import { VariablesService } from '../../shared/variables.service';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  
  private readonly _allMovies$ = this.MovieService.Movies$
  public _movieList: any = []; // when using subscribe() to access to the allMovies$ (above) Observable insted of using async pipe on the *ngFor
 
  public pickedMovie: Movie;
  public errors: any[] = [];
  public details: boolean = false;

  private modalRef: any;
  private tempMovie: any;  
  private subscription: any;
  


  constructor(public MovieService: MoviesService, private modalService: NgbModal, private Variables: VariablesService) {
    console.log(Variables.isMobile)
    this.MovieService.getMovies();
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

  showDetails(){
    if(this.details == false)
      this.details = true;
    else
      this.details = false;
  }

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
        this.pickedMovie = Pickedmovie;
        this.modalRef = this.modalService.open(content);
      }
    );
  }

  editSubmition() {
    this.MovieService.editMovieList(this.pickedMovie);

    if(!this.MovieService.titleError && this.MovieService.validateYear) {
      this.tempMovie = this.pickedMovie;
      this.modalRef.close();
    }
  }


  infoMovie(movie,infocontent){
    this.MovieService.getPickedMovie(movie).subscribe(
      (infoMovie: Movie) => {
        this.pickedMovie = infoMovie;
        this.modalRef = this.modalService.open(infocontent);
      }
    );
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
