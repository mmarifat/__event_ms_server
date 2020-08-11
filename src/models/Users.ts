import {Email, Enum, Format, Property, PropertyType} from "@tsed/common";
import {Indexed, Model, ObjectID, Ref, SchemaIgnore} from "@tsed/mongoose";
import {Types} from "mongoose";
import {IUser} from "../interfaces/IUser";
import {UserType} from "../config/util";
import {IFileProperty} from "../interfaces/IFileProperty";


@Model({
	collection: 'users',
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
export class Users implements IUser {

	@ObjectID("_id")
	_id: Types.ObjectId;

	@PropertyType(Object)
	image: IFileProperty;

	@Property()
	firstName: string;

	@Property()
	lastName: string;

	@Property()
	gender: string;

	@Indexed(true)
	@Email()
	email: string;

	@Property()
	phone: string;

	@Property()
	password: string;

	@Format('ipv4')
	ip: string;

	@Enum(UserType)
	type: UserType;

	@Ref('Users')
	addedBy: Ref<IUser> | string | Types.ObjectId;

	@SchemaIgnore()
	get Name(): string {
		return this.firstName + (this.lastName ? ' ' + this.lastName : '');
	}
}
