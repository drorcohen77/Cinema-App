import { Component, OnInit } from '@angular/core';
import { MoviesService } from 'src/app/store/movies.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {


  private readonly _Favorites$ = this.MovieService.Favorites$;
  private _Favoriteslist: any = [];


  constructor(public MovieService: MoviesService) {
    this.MovieService.getFavorites();
  }

  ngOnInit() {

    this._Favorites$.subscribe(item => {
      this._Favoriteslist = item;
    });
  }


  removeFavorite(favoriteID) {
    this.MovieService.removeFromFavorites(favoriteID);
  }

}
