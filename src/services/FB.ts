import {Service} from "@tsed/common";
import * as admin from "firebase-admin";

@Service()
export class FB {
	auth: admin.auth.Auth

	constructor() {
		var serviceAccount = require("../../firebase.json");
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: "https://auth-event-ms.firebaseio.com"
		});
		this.auth = admin.auth()
	}
}
