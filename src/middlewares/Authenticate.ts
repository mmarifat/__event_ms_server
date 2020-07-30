import {EndpointInfo, IMiddleware, Middleware, Next, Req, Res} from "@tsed/common";
import {ResponseStatus} from "../interfaces/IResponse";
import {FB} from "../services/FB";
import {MongoDb} from "../services/MongoDb";

@Middleware()
export class Authenticate implements IMiddleware {
	constructor(private fb: FB, private db: MongoDb) {
	}

	public use(@Req() req: Req, @EndpointInfo() endpoint: EndpointInfo, @Res()res: Res, @Next() next: Next) {
		const options = endpoint.get(Authenticate) || {};
		if (req.headers.authorization) {
			this.fb.auth.verifyIdToken(req.headers.authorization).then(async success => {
				req.user = await this.db.User.findOne({email: success.email})
				next()
			}).catch(({errorInfo}) => {
				res.json({message: errorInfo.message, status: ResponseStatus.SESSION_EXPIRED, isSuccess: false})
			})
		} else {
			res.json({message: 'No Security credentials Provided!', status: ResponseStatus.ACCESSDENIED, isSuccess: false})
		}
	}
}
