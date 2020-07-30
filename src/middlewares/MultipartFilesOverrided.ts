import {Configuration, EndpointInfo, EndpointMetadata, IMiddleware, OverrideProvider, Req, Res} from "@tsed/common";
import {MultipartFileMiddleware} from "@tsed/multipartfiles";
import * as Express from "express";
import {Request} from "express";
import {promisify} from "util";
import * as multer from "multer";
import * as crypto from 'crypto'

@OverrideProvider(MultipartFileMiddleware)
export class MultipartFileMiddlewareOverrided implements IMiddleware {

	private multer: any = multer;

	constructor(@Configuration() private configuration: Configuration) {
	}

	/**
	 *
	 * @param endpoint
	 * @param request
	 * @param response
	 * @returns {any}
	 */
	async use(@EndpointInfo() endpoint: EndpointMetadata, @Req() request: Express.Request, @Res() response: Express.Response) {
		const endpointConfiguration = endpoint.store.get(MultipartFileMiddleware);
		return await promisify(this.invoke(endpointConfiguration))(request, response);
	}

	invoke(conf: any) {
		const dest = (conf ? (conf.options ? (conf.options.dest ? conf.options.dest : null) : null) : null) || this.configuration.uploadDir;
		const options = Object.assign({
			storage: multer.diskStorage({
				destination(req: Request, file: any, callback: (error: Error | null, destination: string) => void) {
					callback(null, dest)
				},
				filename(req: Req, file: any, callback: (error: (Error | null), filename: string) => void) {
					let customFileName = crypto.randomBytes(16).toString('hex'),
						  fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1]
					callback(null, customFileName + '.' + fileExtension)
				}
			})
		}, this.configuration.get("multer") || {}, conf.options || {});
		if (!conf.any) {
			const fields = conf.fields.map(({name, maxCount}: any) => ({name, maxCount}));
			return this.multer(options).fields(fields);
		}
		return this.multer(options).any();
	}
}
