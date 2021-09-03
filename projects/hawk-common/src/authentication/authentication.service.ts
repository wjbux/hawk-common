import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FirebaseUser } from '../model/FirebaseUser';
import * as firebase from 'firebase';
/**
 * Service to handle all interaction with Firebase auth and user state
 */
@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private _user: Observable<FirebaseUser>;

	constructor(private afAuth: AngularFireAuth) {
		this._user = this.afAuth.authState.pipe(
			switchMap((user) => {
				if (user) {
					return of(
						new FirebaseUser(
							user.uid,
							user.displayName.split(' ')[0] || '',
							user.displayName.split(' ')[1] || '',
							user.displayName,
							user.email,
							user.photoURL
						)
					);
				} else {
					return of(null);
				}
			})
		);
	}

	/**
	 * Sign up using email
	 * @param name username
	 * @param email user email address
	 * @param password user password
	 * @return promise
	 */
	public async signUpEmail(name: string, email: string, password: string): Promise<void> {
		let credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
		return await credential.user.updateProfile({ displayName: name });
	}

	/**
	 * Sign in using email and password
	 * @param email user email address
	 * @param password user password
	 * @return promise
	 */
	public async signInEmail(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
		return await this.afAuth.signInWithEmailAndPassword(email, password);
	}

	/**
	 * Delete current logged in account from Firebase auth
	 * @return promise
	 */
	public deleteAccount(): Promise<void> {
		return firebase.default.auth().currentUser.delete();
	}

	/**
	 * Sign in using Google
	 * @return promise
	 */
	public async googleSignIn(): Promise<firebase.default.auth.UserCredential> {
		const provider = new firebase.default.auth.GoogleAuthProvider();
		return await this.afAuth.signInWithPopup(provider);
	}

	/**
	 * Send password reset email
	 * @param email email to send reset link
	 * @return promise
	 */
	public async resetPassword(email: string): Promise<void> {
		return await this.afAuth.sendPasswordResetEmail(email);
	}

	/**
	 * Sign user out
	 * @return promise to confirm
	 */
	public async signOut(): Promise<void> {
		return await this.afAuth.signOut();
	}

	public get user() {
		return this._user;
	}
}
