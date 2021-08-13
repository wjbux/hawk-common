export class User {
	private _id: string;
	private _fName: string;
	private _lName: string;
	private _displayName: string;
	private _email: string;
	private _photoURL: string;
	private _stripeKey: string;

	constructor(
		id: string,
		fName: string,
		lName: string,
		displayName: string,
		email: string,
		photoURL: string,
		stripeKey: string
	) {
		this._id = id;
		this._fName = fName;
		this._lName = lName;
		this._displayName = displayName;
		this._email = email;
		this._photoURL = photoURL;
		this._stripeKey = stripeKey;
	}

	public toJsonString(): string {
		let json = JSON.stringify(this);
		Object.keys(this)
			.filter((key) => key[0] === '_')
			.forEach((key) => {
				json = json.replace(key, key.substring(1));
			});

		return json;
	}

	/** Get user id */
	public get id(): string {
		return this._id;
	}

	/** Set user id */
	public set id(id: string) {
		this._id = id;
	}

	public get fName(): string {
		return this._fName;
	}

	public set fName(value: string) {
		this._fName = value;
	}

	public get lName(): string {
		return this._lName;
	}
	public set lName(value: string) {
		this._lName = value;
	}

	/** Get user name*/
	public get displayName(): string {
		return this._displayName;
	}

	/** Set user name */
	public set displayName(name: string) {
		this._displayName = name;
	}

	/** Get user email */
	public get email(): string {
		return this._email;
	}

	/** Set user email */
	public set email(email: string) {
		this._email = email;
	}

	/** Get photo URL */
	public get photoURL(): string {
		return this._photoURL;
	}

	/** Set photo URL */
	public set photoURL(photoURL: string) {
		this._photoURL = photoURL;
	}

	public get stripeKey(): string {
		return this._stripeKey;
	}

	public set stripeKey(value: string) {
		this._stripeKey = value;
	}
}
