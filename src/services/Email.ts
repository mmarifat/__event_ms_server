import {Service} from "@tsed/common";
import {createTransport, Transporter} from "nodemailer";

@Service()
export class Email {

	getTransporter(smtp?: any): Transporter {
		let transporter: Transporter = null
		if (smtp) {
			transporter = createTransport({
				host: smtp.server,
				secure: true,
				port: smtp.port,
				priority: "high",
				auth: {
					user: smtp.username,
					pass: smtp.password
				},
			})
		} else {
			transporter = createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS
				}
			});
		}
		return transporter
	}
}
