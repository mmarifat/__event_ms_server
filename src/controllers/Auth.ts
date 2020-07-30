import {Controller, Get, Req, Res, UseAuth} from "@tsed/common";
import {MongoDb} from "../services/MongoDb";
import {FB} from "../services/FB";
import {Core} from "../config/Core";
import {Authenticate} from "../middlewares/Authenticate";

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
}

