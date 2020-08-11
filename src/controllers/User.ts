import {Controller, Delete, HeaderParams, Patch, Post, Put, Req, Res, UseAuth} from "@tsed/common";
import {MongoDb} from "../services/MongoDb";
import {Core} from "../config/Core";
import {MultipartFile} from "@tsed/multipartfiles";
import {Authenticate} from "../middlewares/Authenticate";
import {IDataTableRequest, IDataTableResponse} from "../interfaces/IResponse";
import {Types} from "mongoose";
import {unlink} from "fs";
import {makeFileProperty} from "../interfaces/IFileProperty";
import {Users} from "../models/Users";
import {FB} from "../services/FB";
import * as bcCrypt from "bcryptjs";

@Controller('/user')
export class User extends Core {
	constructor(private fb: FB, private db: MongoDb) {
		super();
	}

	@Post('/')
	@UseAuth(Authenticate)
	async addUser(@Res()res: Res, @Req() req: Req, @MultipartFile("image") image: Express.Multer.File) {
		let {firstName, lastName, gender, email, phone, password, type, ip} = req.body
		let user = new Users()
		let userID = new Types.ObjectId();
		user.firstName = firstName
		user.lastName = lastName
		user.gender = gender
		user.email = email
		user.phone = phone
		user.password = bcCrypt.hashSync(password);
		user.type = type
		user.ip = req.ip
		user.addedBy = Types.ObjectId(String(req.user._id))

		if (image) {
			user.image = makeFileProperty(image)
		}

		await this.fb.auth.createUser({
			displayName: user.Name,
			email: user.email,
			password: password,
			uid: userID.toHexString()
		}).then(async () => {
			await this.db.User.create(user).then((newUser) => {
				this.done(res, 'New User Successfully Added!', {newUser});
			}).catch(reason => {
				this.failed(res, reason.message);
			})
		}).catch(e => {
			e ? console.log(e) : null;
		})
	}

	@Patch('/')
	@UseAuth(Authenticate)
	async getUser(@Req() req: Req, @Res() res: Res) {
		let {pagination, columns, filter}: IDataTableRequest = req.body;
		let startTime = +new Date()
		let conditions: any = {}

		if (filter.fields) {
			filter.fields.forEach((field: string) => {
				conditions[field] = {$regex: new RegExp(filter.value, 'i')};
			})
		}
		await this.db.User.find(conditions, columns)
			  .limit(pagination.rowsPerPage)
			  .skip((pagination.page * pagination.rowsPerPage) - pagination.rowsPerPage)
			  .sort({[pagination.sortBy]: pagination.descending ? -1 : 1})
			  .exec().then(async (users: any) => {
				  console.log(users);
				  let data: IDataTableResponse = {
					  filtered: await this.db.User.find(conditions).estimatedDocumentCount(),
					  rows: users.filter((row: any) => row.firstName !== 'system'),
					  timeInSec: 0,
					  total: await this.db.User.estimatedDocumentCount()
				  }
				  data.timeInSec = ((+new Date()) - (+startTime)) / 1000
				  console.log(data);
				  this.done(res, null, {data})
			  }).catch((reason: any) => {
				  this.failed(res, reason.message);
			  })
	}

	@Delete('/')
	@UseAuth(Authenticate)
	async deleteUser(@Req() req: Req, @Res() res: Res, @HeaderParams('userID') userID: string) {
		this.fb.auth.deleteUser(Types.ObjectId(userID).toHexString()).then(async () => {
			await this.db.User.findByIdAndDelete(Types.ObjectId(userID)).then((del) => {
				if (del.image) {
					unlink(process.env.PWD + '/public/' + del.image.path, err => {
						err ? console.log(err) : null
					})
				}
				this.done(res, 'User Successfully Deleted!', null);
			}).catch(reason => {
				this.failed(res, reason.message);
			})
		})
	}

	@Put('/')
	@UseAuth(Authenticate)
	async editUser(@Res()res: Res, @Req() req: Req, @MultipartFile("image") image: Express.Multer.File) {
		let {_id, firstName, lastName, gender, email, phone, password, type, ip} = req.body
		let edit: any = {}
		if (image) {
			edit = {
				$set: {
					image: makeFileProperty(image), firstName, lastName, gender, email, phone, password, type, ip
				}
			}
		} else {
			edit = {$set: {firstName, lastName, gender, email, phone, password, type, ip}}
		}
		await this.fb.auth.updateUser(_id.toHexString(), {
			displayName: firstName + '' + (lastName || ''), email, password,
		}).then(async () => {
			await this.db.User.findByIdAndUpdate(Types.ObjectId(_id), edit).exec().then((usr) => {
				if (image) {
					unlink(process.env.PWD + '/public/' + usr.image.path, err => {
						err ? console.log(err) : null
					})
				}
				this.done(res, 'User Successfully Edited!');
			}).catch(reason => {
				if (image) {
					unlink(process.env.PWD + '/public/' + image.path, err => {
						err ? console.log(err) : null
					})
				}
				this.failed(res, reason.message);
			})
		}).catch(e => {
			e ? console.log(e) : null;
		})
	}


}