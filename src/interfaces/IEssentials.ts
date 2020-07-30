import {Types} from "mongoose";
import {IFileProperty} from "./IFileProperty";

export interface ILogin {
	email: string
	password: string
	username?: string
}

export interface ICategory {
	_id: Types.ObjectId
	name: string
	image: IFileProperty
}
