import {Configuration, GlobalAcceptMimesMiddleware, Inject, PlatformApplication} from "@tsed/common";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as cors from "cors";
import "@tsed/multipartfiles";
import "@tsed/mongoose";
import * as dt from 'dotenv';
import * as fs from 'fs';

dt.config()
const rootDir = __dirname;
console.log(process.env.NODE_ENV);

@Configuration({
	rootDir,
	acceptMimes: ["application/json"],
	httpsPort: process.env.NODE_ENV === 'production' ? 443 : process.env.HTTPs_PORT,
	httpPort: process.env.HTTP_PORT,
	mount: {
		"/": `${rootDir}/controllers/*`
	},
	exclude: [
		"**/*.spec.ts"
	],
	uploadDir: `${rootDir}/../public/` + process.env.uploadDir,
	statics: {
		"/statics": `${rootDir}/../public/`
	},
	logger: {
		debug: true,
		logRequest: false,
		requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
	},
	componentsScan: [
		`${rootDir}/middlewares/*`,
		`${rootDir}/services/*`,
		// `${rootDir}/converters/**/*.ts`
	],
	multer: {
		limits: {
			fieldNameSize: 1000 * 2084,
			fieldSize: 1000 * 1024 * 2048
		},
		useTempFiles: true,
		tempFileDir: '/tmp/'
	},
	mongoose: {
		url: process.env.dbUrl,
		connectionOptions: {
			authSource: 'admin',
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		},
	},
})
export class Server {
	@Inject()
	app: PlatformApplication;

	@Configuration()
	settings: Configuration;

	$beforeRoutesInit(): any {
		this.app
				.use(cors({
					credentials: true,
					origin: '*',
					allowedHeaders: '*',
					exposedHeaders: '*'
				}))
				.use(GlobalAcceptMimesMiddleware)
				.use(cookieParser())
				.use(compress({}))
				.use(methodOverride())
				.use(bodyParser.json({
					limit: '2048mb'
				}))
				.use(bodyParser.urlencoded({
					limit: '2048mb',
					extended: true,
					parameterLimit: 500000
				}));

		return null;
	}
}

