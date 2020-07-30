import * as crypto from 'crypto'
import {Types} from "mongoose";


const ENCRYPTION_KEY = "$2a$10$T.fd+P0RrSb1K3/QmoWuhp2APkyARNJ/8dhO+SxwzGui3dSJqHecQ="

const IV_LENGTH = 16;

export function encrypt(text: string) {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY).slice(0, 32), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('base64') + '$2a$10$T.fd+' + encrypted.toString('base64');
}

export function decrypt(text: any) {
	try {
		let textParts = text.split('$2a$10$T.fd+');
		let iv = Buffer.from(textParts.shift(), 'base64').slice(0, 16);
		let encryptedText = Buffer.from(textParts.join('$2a$10$T.fd+'), 'base64');
		let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY).slice(0, 32), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	}catch (e) {
		return '5f17c2c775344452fd80ceb3'
	}
}

