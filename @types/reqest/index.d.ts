import {IUser} from "../../src/interfaces/IUser";
import {User} from "../../src/models/User";

declare global {
	namespace Express {

		interface Request {
			user?: IUser | null | User;
			key?: string
		}

		interface Interface {

		}
	}
}

declare const Request: Express.Request;
export = Request;
