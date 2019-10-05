import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MoviesService } from 'src/app/store/movies.service';
import { Movie } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public validatSearch: Boolean = true;
  public item:string = '';
  private modalRef: any;
  
  public pickedMovie: Movie;
  

  constructor(private MovieService: MoviesService, private modalService: NgbModal) { }

  ngOnInit() {
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

  searchMovie() {
    this.validatSearch = true;

    if(this.item.length==0) {
      this.validatSearch = false;
    }else{
      this.MovieService.Search(this.item)
    }
  }

}