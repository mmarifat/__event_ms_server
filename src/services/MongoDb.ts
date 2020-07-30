import {Inject, Service} from "@tsed/common";
import {MongooseModel, MongooseService} from "@tsed/mongoose";
import {User} from "../models/User";
import Mongoose from "mongoose";

@Service()
export class MongoDb {
	@Inject(User)
	public User: MongooseModel<User>;

	public mongoose: Mongoose.Connection;

	constructor(mongo: MongooseService) {
		this.mongoose = mongo.get();
	}
}