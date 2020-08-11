import {Model, ObjectID} from "@tsed/mongoose";
import {ICategory} from "../interfaces/IEssentials";
import {IFileProperty} from "../interfaces/IFileProperty";
import {Types} from "mongoose";
import {Property, PropertyType} from "@tsed/common";

@Model({
	collection: 'categories',
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
export class Categories implements ICategory {
	@ObjectID("_id")
	_id: Types.ObjectId;

	@Property()
	name: string;

	@PropertyType(Object)
	image: IFileProperty;
}