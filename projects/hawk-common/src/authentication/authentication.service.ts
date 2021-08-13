import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './User';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
/**
 * Service to handle all interaction with Firebase and user state
 */
@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	public user$: Observable<any>;
	public currentUser: User;

	constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore) {
		this.user$ = this.afAuth.authState.pipe(
			switchMap((user) => {
				if (user) {
					let getUser = this.afStore.doc<User>(`userData/${user.uid}`).valueChanges();
					// Create current user using our model
					getUser.subscribe((user) => {
						this.currentUser = new User(
							user.id,
							user.fName,
							user.lName,
							user.displayName,
							user.email,
							user.photoURL,
							user.stripeKey
						);
					});
					return getUser;
				} else {
					return of(null);
				}
			})
		);
	}

	private updateUserData(user: any): Promise<void> {
		let userRef: AngularFirestoreDocument<User> = this.afStore.doc(`userData/${user.uid}`);

		this.currentUser = new User(
			user.uid,
			user.displayName.split(' ')[0] || '',
			user.displayName.split(' ')[1] || '',
			user.displayName,
			user.email,
			user.photoURL,
			user.stripeKey
		);
		let userJson = JSON.parse(this.currentUser.toJsonString());
		return userRef.set(userJson, { merge: true });
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
		credential.user.updateProfile({ displayName: name });
		return this.updateUserData(credential.user);
	}

	/**
	 * Sign in using email and password
	 * @param email user email address
	 * @param password user password
	 * @return promise
	 */
	public async signInEmail(email: string, password: string): Promise<void> {
		let credential = await this.afAuth.signInWithEmailAndPassword(email, password);
		return this.updateUserData(credential);
	}

	/**
	 * Sign in using Google
	 * @return promise
	 */
	public async googleSignIn(): Promise<void> {
		const provider = new firebase.default.auth.GoogleAuthProvider();
		const credential = await this.afAuth.signInWithPopup(provider);
		return this.updateUserData(credential.user);
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
}
