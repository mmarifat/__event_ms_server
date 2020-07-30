import {Controller, Post, Req, Res} from "@tsed/common";
import {MongoDb} from "../services/MongoDb";
import {Core} from "../config/Core";
import {Email} from "../services/Email";
import {Users} from "../models/Users";
import {Types} from "mongoose";
import * as bcCrypt from "bcryptjs";
import {Status} from "../config/util";
import {FB} from "../services/FB";

@Controller('/dev')
export class Dev extends Core {
	constructor(private db: MongoDb, private email: Email, private fb: FB) {
		super();
	}

	@Post('/signUp')
	async signUp(@Res()res: Res, @Req()req: Req) {
		let {username, email, password} = req.body
		let user = new Users()
		let userID = new Types.ObjectId();
		user.email = email
		user.firstName = username
		user.lastName = ''
		user.password = bcCrypt.hashSync(password);
		user.status = Status.ACTIVE

		await this.fb.auth.createUser({
			displayName: user.Name,
			email: user.email,
			password: password,
			uid: userID.toHexString()
		}).then(async () => {
			await this.db.User.create(user).then(newUser => {
				this.done(res, 'New Users Successfully Created! You can login now!', {newUser});
			})
		})
	}
}
