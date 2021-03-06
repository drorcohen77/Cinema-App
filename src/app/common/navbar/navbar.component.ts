import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MoviesService } from 'src/app/store/movies.service';
import { Movie } from 'src/app/shared/movie.model';
import { VariablesService } from 'src/app/shared/variables.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // public readonly isMobile: Boolean;
  private openSearch: Boolean;
  public validatSearch: Boolean = true;
  public item:string = '';
  private modalRef: any;
  
  public pickedMovie: Movie;

  private readonly _Favorites$ = this.MovieService.Favorites$;
  private _FavoritesNumber: number ;
  

  constructor(private MovieService: MoviesService, private modalService: NgbModal,public variables: VariablesService, private nav: Router) {
   
    this.MovieService.getFavorites();
   }

  ngOnInit() {
    this._Favorites$.subscribe(item => {
      
      this._FavoritesNumber = item.length;
    });
  }

  favorites() {
    this.variables.backToMain = false;
    this.nav.navigate(['/main/favorites']);
  }

  backToMainPage() {
    this.variables.backToMain = true;
    this.nav.navigate(['/main/movies']);
  }

  addMovie(content) {
    
    this.pickedMovie = new Movie;
    this.modalRef = this.modalService.open(content);
  }

  addSubmition() {
    this.MovieService.addMovie(this.pickedMovie);

    if(!this.MovieService.titleError && this.MovieService.validateYear) 
      this.modalRef.close();
    
  }

  openSearchBar(){
    if(this.openSearch == false || this.openSearch == undefined)
      this.openSearch = true;
    else
      this.openSearch = false;
      this.validatSearch = true;
      this.MovieService.validatResults = true;
      this.MovieService.LoadSpiner = false;
  }

  searchMovie() {
    this.validatSearch = true;

    if(this.item.length==0) {
      this.validatSearch = false;
    }else{
      this.MovieService.Search(this.item);
      this.backToMainPage();
      this.openSearch = false;
    }
    this.item = '';
  }

}
