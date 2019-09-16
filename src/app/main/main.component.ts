import { Movie } from './../Services/movie.model';
import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../Services/movies.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  public allMovies: Movie[] = [];

  constructor(private MovieService: MoviesService) { }

  ngOnInit() {

    this.MovieService.getMovies().subscribe(
      (movies: Movie[]) => {
        this.allMovies = movies;
        console.log(this.allMovies);
      },
      (err) =>{}
    );

  }

}
