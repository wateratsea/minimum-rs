/*!
 * core.js v0.0.1
 *
 * Copyright (c) 2018 wateratsea
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 *
 */
const http	= require('http');
const url	= require('url');
const fs	= require('fs');
const path	= require('path');
const https = require('https');

const service = receipt(entrance);
var settings = {
	http: {
		port: 9080
	},
	https:{
		port: 9443
	},
	documentRoot: path.resolve('htdocs'),
	filters: [],
	interceptors: [],
	api: {},
	customize: {}
};
module.exports = {
	run: (arg) => {
		settings = arg;
		const server = http.createServer(settings.customize, service);
		server.listen(settings.http.port);
		if(!settings.https && !settings.https.port)
			return;
		const https_server = https.createServer(settings.customize, service);
		https_server.listen(settings.https.port);
	}
};
function receipt(func){
	return async function(){
		const req = arguments[0];
		const res = arguments[1];
		for(var i in settings.filters){
			const filter = settings.filters[i];
			await filter(req, res);
		}
		const app = await func.apply(this, arguments);
		return app;
	}
}
async function entrance(req, res){
	var uri = url.parse(req.url);
	var app = await getService(settings.api, uri);
	if (app) {
		const obj = new app();
		try {
			var method = obj[req.method.toLowerCase()];
			if(method) {
				var list = [];
				for(var i in settings.interceptors) {
					list.push(settings.interceptors[i]);
				}
				var val = null;
				while((val = list.pop()) != null){
					method = val(method);
				}
				var result = await method(req, res);
				res.write(result);
			} else {
				res.writeHead(404, {'Content-Type': 'text/plain'});
			}
		} catch (err) {
			console.log(err);
			if(err.status){
				res.writeHead(err.status, {'Content-Type': 'text/plain'});
			} else {
				res.writeHead(500, {'Content-Type': 'text/plain'});
			}
		} finally {
			res.end();
		}
	} else {
		var p = path.join(settings.documentRoot, uri.pathname.replace(/\//, path.sep));
		try {
			if (fs.statSync(p).isDirectory()) {
				p = path.join(p, 'index.html');
			}
			var data = fs.readFileSync(p);
			res.write(data);
		} catch(err) {
			res.writeHead(404, {'Content-Type': 'text/plain'});
		} finally {
			res.end();
		}
	}
	return new Promise(resolve => {
		resolve(this);
	});
}
async function getService(obj, uri) {
	var u = uri.pathname;
	const promize = (services) => new Promise((resolve, reject) => {
		const select = (obj, key) => {
			const paths = key.replace(/^\//, '').split('/');
			var value = obj;
			const length = paths.length;
			for(var i = 0; i < length; i++) {
				const key = paths[0];
				if(value.hasOwnProperty(key)) {
					value = value[key];
				} else if(i > 0) {
					break;
				} else {
					return null;
				}
				paths.shift();
			}
			if(value)
				return value;
			return null;
		};
		const ret = select(services, u);
		if (ret == null) {
			resolve(null);
		}
		resolve(ret);
	});
	return promize(obj);
}
