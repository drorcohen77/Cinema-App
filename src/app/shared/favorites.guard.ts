import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VariablesService } from './variables.service'


@Injectable()
export class FavoritesGuard implements CanActivate {


  constructor(private nav: Router, private Variables: VariablesService ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if(this.Variables.backToMain) {
        this.nav.navigate(['main/movies']);
        return false;
    }
    return true;
  }

}