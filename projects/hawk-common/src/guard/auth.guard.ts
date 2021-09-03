import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { take, map, tap } from 'rxjs/operators';
/**
 * Service to handle route guards and prevent unauthorised access
 */
@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private auth: AuthenticationService, private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth.user.pipe(
			take(1),
			// Map user to boolean
			map((user) => !!user),
			tap((loggedIn) => {
				if (!loggedIn) {
					console.warn('User must be logged in to access this page');
					this.router.navigate(['/login']);
				}
			})
		);
	}
}
