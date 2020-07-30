import {Controller, Delete, HeaderParams, Patch, Post, Put, Req, Res, UseAuth} from "@tsed/common";
import {MongoDb} from "../services/MongoDb";
import {Core} from "../config/Core";
import {MultipartFile} from "@tsed/multipartfiles";
import {Authenticate} from "../middlewares/Authenticate";
import {IDataTableRequest, IDataTableResponse} from "../interfaces/IResponse";
import {Types} from "mongoose";
import {unlink} from "fs";
import {makeFileProperty} from "../interfaces/IFileProperty";
import {Categories} from "../models/Categories";

@Controller('/category')
export class Category extends Core {
	constructor(private db: MongoDb) {
		super();
	}

	@Post('/')
	@UseAuth(Authenticate)
	async addCategory(@Res()res: Res, @Req() req: Req, @MultipartFile("image") image: Express.Multer.File) {
		let cat = new Categories()
		cat.name = req.body.name
		if (image) {
			cat.image = makeFileProperty(image)
		}
		await this.db.Category.create(cat).then((newCategory) => {
			this.done(res, 'New Categories Successfully Added!', {newCategory});
		}).catch(reason => {
			this.failed(res, reason.message);
		})
	}

	@Patch('/')
	@UseAuth(Authenticate)
	async getCategory(@Req() req: Req, @Res() res: Res) {
		let {pagination, columns, filter}: IDataTableRequest = req.body;
		let startTime = +new Date()
		let conditions: any = {}

		if (filter.fields) {
			filter.fields.forEach((field: string) => {
				conditions[field] = {$regex: new RegExp(filter.value, 'i')};
			})
		}
		await this.db.Category.find(conditions, columns)
			  .limit(pagination.rowsPerPage)
			  .skip((pagination.page * pagination.rowsPerPage) - pagination.rowsPerPage)
			  .sort({[pagination.sortBy]: pagination.descending ? -1 : 1})
			  .exec().then(async (categories: any) => {
				  let data: IDataTableResponse = {
					  filtered: await this.db.Category.find(conditions).estimatedDocumentCount(),
					  rows: categories.filter((row: any) => row.name),
					  timeInSec: 0,
					  total: await this.db.Category.estimatedDocumentCount()
				  }
				  data.timeInSec = ((+new Date()) - (+startTime)) / 1000
				  this.done(res, null, {data})
			  }).catch((reason: any) => {
				  this.failed(res, reason.message);
			  })
	}

	@Delete('/')
	@UseAuth(Authenticate)
	async deleteCategory(@Req() req: Req, @Res() res: Res, @HeaderParams('categoryID') categoryID: string) {
		await this.db.Category.findByIdAndDelete(Types.ObjectId(categoryID)).then((del) => {
			if (del.image) {
				unlink(process.env.PWD + '/public/' + del.image.path, err => {
					err ? console.log(err) : null
				})
				unlink(process.env.PWD + '/public/thumbs/' + del.image.name, err => {
					err ? console.log(err) : null
				})
			}
			this.done(res, 'Category Successfully Deleted!', null);
		}).catch(reason => {
			this.failed(res, reason.message);
		})
	}

	@Put('/')
	@UseAuth(Authenticate)
	async editCategory(@Res()res: Res, @Req() req: Req, @MultipartFile("image") image: Express.Multer.File) {
		let {_id, name} = req.body
		let edit: any = {}
		if (image) {
			edit = {
				$set: {
					image: makeFileProperty(image), name
				}
			}
		} else {
			edit = {$set: {name}}
		}
		await this.db.Category.findByIdAndUpdate(Types.ObjectId(_id), edit).exec().then((cat) => {
			if (image) {
				unlink(process.env.PWD + '/public/' + cat.image.path, err => {
					err ? console.log(err) : null
				})
			}
			this.done(res, 'Category Successfully Edited!');
		}).catch(reason => {
			if (image) {
				unlink(process.env.PWD + '/public/' + image.path, err => {
					err ? console.log(err) : null
				})
			}
			this.failed(res, reason.message);
		})
	}


}