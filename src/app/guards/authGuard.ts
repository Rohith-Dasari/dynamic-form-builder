import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from "@angular/router";

@Injectable({
    providedIn:'root',
})
export class AuthGuard implements CanActivate{
    private router=inject(Router);

    canActivate(route:ActivatedRouteSnapshot):boolean| UrlTree{
        return this.checkAccess(route);
    }

    private checkAccess(route:ActivatedRouteSnapshot):boolean| UrlTree{
        const userRole=localStorage.getItem('role');
        const targetPath = route.routeConfig?.path;

        if(!userRole) return this.router.parseUrl('/login');

        if(userRole==='user'){
            return targetPath === 'form' ? true : this.router.parseUrl('/form');
        }
        
        if(userRole==='admin'){
            return targetPath === 'builder' ? true : this.router.parseUrl('/builder');
        }

        return this.router.parseUrl('/login');
    }

}