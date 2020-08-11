import {Ref} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Gender, UserType} from "../config/util";
import {IFileProperty} from "./IFileProperty";

export interface IUser {
	_id?: Types.ObjectId;

	image: IFileProperty | any;

	firstName: string;

	lastName: string;

	gender: Gender;

	email: string;

	phone: string;

	password: string;

	ip?: string;

	type: UserType;

	addedBy?: Ref<IUser> | string | Types.ObjectId;
}
