import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoviesService } from 'src/app/store/movies.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit,OnDestroy {


  private readonly _Favorites$ = this.MovieService.Favorites$;
  private _Favoriteslist: any = [];
  private subscription: any;

  constructor(public MovieService: MoviesService) {

    
   }

  ngOnInit() {
    this.subscription = this._Favorites$.subscribe(item => {
      this._Favoriteslist = item;
      console.log( this._Favoriteslist)
    });
  }


  removeFavorite(favoriteID) {
    this.MovieService.removeFromFavorites(favoriteID);
  }

  ngOnDestroy() : void {

    this.subscription.unsubscribe()
  }

}
