import {Email, Enum, Format, Property, PropertyType} from "@tsed/common";
import {Indexed, Model, ObjectID, Ref, SchemaIgnore} from "@tsed/mongoose";
import {Types} from "mongoose";
import {IAddress, IUser} from "../interfaces/IUser";
import {Collections, Status} from "../config/util";
import {IFileProperty} from "../interfaces/IFileProperty";


export class Address implements IAddress {
	@Property()
	address: string;

	@Property()
	city: string;

	@Property()
	zip: string;
}


@Model({
	collection: Collections.USERS,
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
export class User implements IUser {

	@ObjectID("_id")
	_id: Types.ObjectId;

	@PropertyType(Object)
	image: IFileProperty;

	@Property()
	firstName: string;

	@Property()
	lastName: string;

	@PropertyType(Date)
	birthDate: Date;

	@Property()
	gender: string;

	@PropertyType(Object)
	address: IAddress;

	@Indexed(true)
	@Email()
	email: string;

	@Property()
	phone: string;

	@PropertyType(Date)
	hireDate: Date;

	@PropertyType(Date)
	startDate: Date;

	@Property()
	password: string;

	@Format('ipv4')
	ip: string;

	@Enum(Status)
	status: Status;

	@Ref('User')
	addedBy: Ref<IUser> | string | Types.ObjectId;

	@SchemaIgnore()
	get Name(): string {
		return this.firstName + (this.lastName ? ' ' + this.lastName : '');
	}
}
