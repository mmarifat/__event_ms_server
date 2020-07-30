import {Ref} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Status} from "../config/util";
import {IFileProperty} from "./IFileProperty";


export interface IAddress {
	address: string

	city: string;

	zip: string;

	[s: string]: any
}

export interface IUser {

	_id: Types.ObjectId;

	image: IFileProperty;

	firstName: string;

	lastName: string;

	birthDate: Date;

	gender: string;

	//contact
	address: IAddress;

	email: string;

	phone: string;

	hireDate: Date;

	startDate: Date;

	password: string;

	ip: string;

	status: Status;

	addedBy: Ref<IUser> | string | Types.ObjectId;
}
