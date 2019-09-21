import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title'
})
export class TitlePipe implements PipeTransform {

  public str = '';

  transform(value: any): any {

    this.str = value.replace(/[^\w\s]/gi, "").trim().replace(/\b\w/g, (s) => s.toUpperCase());
    
    return this.str; 
  }

}
