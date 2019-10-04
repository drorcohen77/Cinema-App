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
  private _movieList: any = []; // when using subscribe() to access to the allMovies$ (above) Observable insted of using async pipe on the *ngFor
 
  public pickedMovie: Movie;
  public errors: any[] = [];

  private modalRef: any;
  private tempMovie: any;  
  

  constructor(private MovieService: MoviesService, private modalService: NgbModal, private apiVariables: VariablesService) {
    
    // using subscribe() to access to the allMovies$ (above) Observable insted of using async pipe on the *ngFor
    // the subscribe method get's us to the _value property inside the Observable where the data from the API request is stored
    // after we get access to the allMovies$ by subscription, we can manipulate the data (in this case te moveiList array)//

    this._allMovies$.subscribe(Movie => { 
      this._movieList = Movie;
      
      for (let i=0;i<this._movieList.length;i++) {
        
        if(this._movieList[i].Poster == 'N/A')
          this._movieList[i].Poster = this.apiVariables.noPic;
      }
    });
   }


  ngOnInit(): void {

    this.MovieService.getMovies()
    
  }

  editMovie(movieID,content) {

    this.pickedMovie = new Movie;

    this.MovieService.getPickedMovie(movieID).subscribe(
      (Pickedmovie: Movie) => {
        if(this.tempMovie != undefined)
          this.pickedMovie =this.tempMovie;
        else
          this.pickedMovie = Pickedmovie;
            
      },
      (errorResponse) => {
        this.errors = errorResponse.error.errors;
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
   console.log(this._movieList)
    this.modalRef = this.modalService.open(content);
  }

  editSubmition(movie) {
    this.MovieService.editMovieList(movie);

    if(!this.MovieService.titleError && this.MovieService.validateYear) {
      this.tempMovie = movie;
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

    this._movieList.unsubscribe()
    
  }
}
