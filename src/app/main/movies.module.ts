import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MainComponent } from '../main/main.component';

import { TitlePipe } from '../common/Pipes/title.pipe';
import { MoviesService } from '../store/movies.service';



@NgModule({
  declarations: [
    MainComponent,
    TitlePipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [MoviesService]
})
export class MainModule { }