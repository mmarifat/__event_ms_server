import {BodyParams, Controller, Patch, Post, Req, Res, UseAuth} from "@tsed/common";
import {MongoDb} from "../services/MongoDb";
import {Core} from "../config/Core";
import {ValidateRequest} from "../middlewares/ValidateRequest";
import {ICategory} from "../interfaces/IEssentials";
import {Category} from "../models/Category";
import {makeFileProperty} from "../interfaces/IFileProperty";
import {MultipartFile} from "@tsed/multipartfiles";
import {Authenticate} from "../middlewares/Authenticate";
import {IDataTableRequest, IDataTableResponse} from "../interfaces/IResponse";

@Controller('/category')
@UseAuth(ValidateRequest)
export class Auth extends Core {
	constructor(private db: MongoDb) {
		super();
	}

	@Post('/')
	@UseAuth(Authenticate)
	async addCategory(@Res()res: Res, @Req() req: Req, @MultipartFile("image") image: Express.Multer.File,
	                  @BodyParams('category') category: ICategory) {
		let cat = new Category()
		cat.name = category.name
		if (category.image) {
			cat.image = makeFileProperty(image, null, true)
		}
		await this.db.Category.create(cat).then((newCategory) => {
			this.done(res, 'New Category Successfully Added!', {newCategory});
		}).catch(reason => {
			this.failed(res, reason.message);
		})
	}

	@Patch('/')
	async getCategory(@Req() req: Req, @Res() res: Res) {
		console.log(req.body);
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

}