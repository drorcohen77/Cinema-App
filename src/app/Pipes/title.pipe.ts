import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title'
})
export class TitlePipe implements PipeTransform {

  public str = '';

  transform(value: any): any {

    this.str = value.replace(/[^\w\s]/gi, "").trim().replace(/\b\w/g, (s) => s.toUpperCase());

    // value => value.toLowerCase()
    // .split(' ')
    // .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    // .join(' ');
    
    return this.str; 
  }

}
