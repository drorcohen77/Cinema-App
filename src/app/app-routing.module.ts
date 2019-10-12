import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './main/favorites/favorites.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/movies',
    pathMatch:'full'
  },
  {
    path: 'movies',
    component: MainComponent
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
