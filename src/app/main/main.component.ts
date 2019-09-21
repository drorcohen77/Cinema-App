import { Movie } from './../Services/movie.model';
import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../Services/movies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  
  public allMovies: Array<any> = [];
  public Movies: Object = {
    Search:''
  }
  public pickedMovie: Movie;
  public errors: any[] = [];
  public titleError: Boolean = false;
  public AddEdit: string = ''; 
  public item:string = '';
  public validateYear: Boolean = true;
  public validatSearch: Boolean = true;
  public validatResults: Boolean = true;

  private movieID: string = '';
  private modalRef: any;
  private addedMovie: Movie;
  private tempMovie: Object = {};  
  

  constructor(private MovieService: MoviesService, private modalService: NgbModal) { }

  ngOnInit() {

    this.MovieService.getMovies().subscribe(
      (Movies) => {
        this.allMovies = Movies.Search;
        console.log(this.allMovies);
        console.log(this.allMovies[1].Title);
      },
      (errorResponse) => {
        this.errors = errorResponse.error.errors;}
    );

  }

  editMovie(movieID,content) {
    console.log(movieID);
    this.AddEdit = "Edit";
    this.pickedMovie = new Movie;

    this.MovieService.getPickedMovie(movieID).subscribe(
      (Pickedmovie: Movie) => {
        this.pickedMovie = Pickedmovie;
      // if(Pickedmovie.imdbID == this.tempMovie.movieID)
      //   this.pickedMovie = Pickedmovie;
      // else
      //   this.pickedMovie = this.tempMovie;
      },
      (errorResponse) => {
        this.errors = errorResponse.error.errors;
      }
    );
    
    this.titleError = false;
    this.modalRef = this.modalService.open(content);
  }

  editSubmition() {
    
    for (let i=0;i<this.allMovies.length;i++) {
      if(this.allMovies[i].imdbID == this.pickedMovie.imdbID) {
        
        this.validateMovieName();

        this.validatYear();

        if(!this.titleError && this.validateYear) {
      
          this.allMovies[i]= this.pickedMovie;
          this.modalRef.close();
        }
      }
    }
  }

  addMovie(content) {
    
    this.pickedMovie = new Movie;
    this.AddEdit = "Add";
    this.modalRef = this.modalService.open(content);
  }

  addSubmition() {
    this.titleError = false;
    this.validateYear = true;

    this.validateMovieName();

    this.validatYear();

    if(!this.titleError && this.validateYear) {
      
      this.allMovies.push(this.pickedMovie);
      this.tempMovie = this.pickedMovie;
      console.log(this.tempMovie);
      this.modalRef.close();
    }
  }

  deletMovie(movieID,delcontent) {
    for(let i=0;i<this.allMovies.length;i++) {
      if(this.allMovies[i].imdbID == movieID) {
        this.pickedMovie = this.allMovies[i];
      }
    }
    this.modalRef = this.modalService.open(delcontent);
  }

  deletSubmition(movieID) {
    for(let i=0;i<this.allMovies.length;i++) {
      if(this.allMovies[i].imdbID == movieID) {
        this.allMovies.splice(i,1);
      }
    }
    this.modalRef.close();
  }

  
  validateMovieName() {
    this.titleError = false;
    this.allMovies.forEach((movie) =>{
      if(movie.Title.toLowerCase() == this.pickedMovie.Title.toLowerCase() && movie.imdbID != this.pickedMovie.imdbID){
        this.titleError = true;
        }
      });
  }


  validatYear() {
    this.validateYear = true;

    if(!moment(this.pickedMovie.Year,'YYYY',true).isValid())
      this.validateYear = false;
  }

  searchMovie() {
    this.validatSearch = true;
    this.validatResults = true;

    if(this.item.length==0) {
      this.validatSearch = false;
    }else{
      this.MovieService.Search(this.item).subscribe(
        (Movies) =>{
          
          this.allMovies = Movies.Search;
          
          if(this.allMovies==undefined) {
            this.validatResults = false;
          }
        },
        (errorResponse) => {
          this.errors = errorResponse.error.errors;
        }
      );
    }
  }

}
