import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../store/movies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  private validatSearch: Boolean = true;
  public validatResults: Boolean = true;
  public item:string = '';
  public errors: any[] = [];
  public allMovies: Array<any> = [];
  

  constructor(private MovieService: MoviesService, private modalService: NgbModal) { }

  ngOnInit() {
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
