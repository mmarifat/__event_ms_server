import {Model, ObjectID} from "@tsed/mongoose";
import {ICategory} from "../interfaces/IEssentials";
import {IFileProperty} from "../interfaces/IFileProperty";
import {Types} from "mongoose";
import {Property, PropertyType} from "@tsed/common";
import {Collections} from "../config/util";

@Model({
	collection: Collections.CATEGORIES,
	schemaOptions: {
		toJSON: {
			getters: true,
			versionKey: false
		},
		timestamps: {
			createdAt: true,
			updatedAt: true
		},
		minimize: false
	}
})
export class Category implements ICategory {
	@ObjectID("_id")
	_id: Types.ObjectId;

	@Property()
	name: string;

	@PropertyType(Object)
	image: IFileProperty;
}