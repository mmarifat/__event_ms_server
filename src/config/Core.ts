import {Res} from "@tsed/common";
import {ResponseStatus} from "../interfaces/IResponse";

export class Core {

	failed(res: Res, message: string | null = 'Operation Failed!', status: ResponseStatus = ResponseStatus.ERROR, data: any = undefined) {

		res.json({message, ...data, status, isSuccess: false})
	}

	invalid(res: Res, message: string | null = 'Invalid Request!', caption: string = 'All Fields required fields are not present!', data: any = undefined) {

		res.json({message, ...data, status: ResponseStatus.INVALID, isSuccess: false, caption})
	}

	done(res: Res, message: string = 'Operation Success!', data: any = undefined, caption?: string, status: ResponseStatus = ResponseStatus.SUCCESS) {
		if (!message || !message.length) {
			message = 'Success!'
		}
		res.json({message, ...data, status, isSuccess: true, caption})
	}

	parseVariables(body: string, keyValue: any): string {
		let html = '';
		Object.keys(keyValue).forEach(key => {
			html = body.replace(new RegExp('{{' + key + '}}', 'g'), keyValue[key])
		})
		return html;
	}
}
