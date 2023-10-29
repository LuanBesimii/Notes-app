import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> | boolean{
    if(state.url == "/")
      this.router.navigate(['/login'])
    if(state.url == "/login"){
      if(this.authService.verifyAuthentication()){
        this.router.navigate(['/note'])
        return false
      }
      return true
    }
    if(this.authService.verifyAuthentication())
      return true
    this.router.navigate(['/login'])
    return false
  }
}
