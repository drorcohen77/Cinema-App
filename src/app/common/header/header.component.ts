import { Component, OnInit } from '@angular/core';
import { MoviesService } from 'src/app/store/movies.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // private readonly _Favorites$ = this.MovieService.Favorites$;
  // private _FavoritesNumber: number ;


  constructor(private MovieService: MoviesService) {
    // this.MovieService.getFavorites();
  }

  ngOnInit() {
    
    // this._Favorites$.subscribe(item => {
      
    //   this._FavoritesNumber = item.length;
    // });
  }

  

}
