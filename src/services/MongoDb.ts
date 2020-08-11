import {Inject, Service} from "@tsed/common";
import {MongooseModel, MongooseService} from "@tsed/mongoose";
import Mongoose from "mongoose";
import {Users} from "../models/Users";
import {Categories} from "../models/Categories";

@Service()
export class MongoDb {
	@Inject(Users)
	public User: MongooseModel<Users>;

	@Inject(Categories)
	public Category: MongooseModel<Categories>;

	public mongoose: Mongoose.Connection;

	constructor(mongo: MongooseService) {
		this.mongoose = mongo.get();
	}
}
