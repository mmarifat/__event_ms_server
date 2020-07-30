/*
 * Author S Brinta<brrinta@gmail.com>
 * Email: brrinta@gmail.com
 * Web: https://brinta.me
 * Created on : Thursday 28 May, 2020 10:14:52 BDT
 */

import {IMiddleware, Middleware, Next, Req, Res} from "@tsed/common";
import {ResponseStatus} from "../interfaces/IResponse";
import {MongoDb} from "../services/MongoDb";
import {Types} from "mongoose";

@Middleware()
export class ValidateRequest implements IMiddleware {
	constructor(private db: MongoDb) {
	}

	public async use(@Req() req: Req, @Res()res: Res, @Next() next: Next) {
		if (await this.db.Setting.findById(Types.ObjectId(String(req.headers.key))).countDocuments() == 1) {
			// @ts-ignore
			req.key = req.headers.key || '';
			next()
		} else {
			res.json({message: 'Request from an invalid app!', status: ResponseStatus.ACCESSDENIED, isSuccess: false})
		}
	}
}
