import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MainComponent } from '../main/main.component';

import { TitlePipe } from '../common/Pipes/title.pipe';
import { MoviesService } from '../store/movies.service';
import { FavoritesComponent } from './favorites/favorites.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesGuard } from '../shared/favorites.guard';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
  {
    path:'main',
    component:MainComponent,
    children:[
      {path: 'movies', component: MainPageComponent},
      {path: 'favorites', component: FavoritesComponent, canActivate: [FavoritesGuard]}
    ]
  }
]


@NgModule({
  declarations: [
    MainComponent,
    TitlePipe,
    FavoritesComponent,
    MainPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes),
    BrowserAnimationsModule,
    BrowserModule
  ],
  providers: [MoviesService,FavoritesGuard]
})
export class MainModule { }