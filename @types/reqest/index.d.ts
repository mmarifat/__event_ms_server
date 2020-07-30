import {IUser} from "../../src/interfaces/IUser";
import {Users} from "../../src/models/Users";

declare global {
	namespace Express {

		interface Request {
			user?: IUser | null | Users;
			key?: string
		}

		interface Interface {

		}
	}
}

declare const Request: Express.Request;
export = Request;
