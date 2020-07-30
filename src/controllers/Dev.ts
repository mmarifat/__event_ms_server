import {Controller} from "@tsed/common";
import {MongoDb} from "../services/MongoDb";
import {Core} from "../config/Core";
import {Email} from "../services/Email";

@Controller('/dev')
export class Dev extends Core {
	constructor(private db: MongoDb, private email: Email) {
		super();
	}
}
