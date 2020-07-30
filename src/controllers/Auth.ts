import {Controller, Get, Post, Req, Res, UseAuth} from "@tsed/common";
import {MongoDb} from "../services/MongoDb";
import {FB} from "../services/FB";
import {Core} from "../config/Core";
import {Authenticate} from "../middlewares/Authenticate";
import {User} from "../models/User";
import {Status} from "../config/util";
import * as bcCrypt from 'bcryptjs';
import {Types} from "mongoose";

@Controller('/')
export class Auth extends Core {
	constructor(private fb: FB, private db: MongoDb) {
		super();
	}

	@Get('/')
	async running(@Res()res: Res, @Req() req: Req) {
		res.send('<h1><b>Running........</b></h1>')
	}

	@Get('/auth')
	@UseAuth(Authenticate)
	async login(@Res()res: Res, @Req() req: Req) {
		await this.fb.auth.verifyIdToken(req.headers.authorization || '').then(async success => {
			let user = await this.db.User.findOne({email: success.email}).select({password: 0})
			this.done(res, null, {user})
		})
	}

	@Post('/signUp')
	async signUp(@Res()res: Res, @Req()req: Req) {
		let {username, email, password} = req.body
		let user = new User()
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
				this.done(res, 'New User Successfully Created! You can login now!', {newUser});
			})
		})
	}
}

