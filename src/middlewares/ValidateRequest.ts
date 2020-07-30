import {IMiddleware, Middleware, Next, Req, Res} from "@tsed/common";
import {ResponseStatus} from "../interfaces/IResponse";
import {MongoDb} from "../services/MongoDb";
import {Types} from "mongoose";

@Middleware()
export class ValidateRequest implements IMiddleware {
	constructor(private db: MongoDb) {
	}

	public async use(@Req() req: Req, @Res()res: Res, @Next() next: Next) {
		if (await this.db.User.findById(Types.ObjectId(String(req.headers.key))).countDocuments() == 1) {
			// @ts-ignore
			req.key = req.headers.key || '';
			next()
		} else {
			res.json({message: 'Request from an invalid app!', status: ResponseStatus.ACCESSDENIED, isSuccess: false})
		}
	}
}
