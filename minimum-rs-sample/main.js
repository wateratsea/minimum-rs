/*!
 * main.js v0.0.1
 *
 * Copyright (c) 2018 wateratsea
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 *
 */
const service = require('minimum-rs-server');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length / 2;
const proc = require('process');
const headers = require('./CustmizeHeaders');
const fs	= require('fs');
const ssl_key = 'D:\\work\\certs\\keys\\server.key';
const ssl_crt = 'D:\\work\\certs\\keys\\server.crt';

class api1 {
	async get(req, res){
		const i = proc.send({
			cmd: 'notifyRequest',
			message: 'sent message from api1 of get.'
		});
		res.writeHead(200, {'Content-Type': 'text/plain'});
		return new Promise(resolve => resolve('hello world. from the method of get in api1 on workspace at ' + new Date()));
	}
	async post(req, res){
		const i = proc.send({
			cmd: 'notifyRequest',
			message: 'sent message from api1 of post.'
		});
		res.writeHead(201, {'Content-Type': 'text/plain'});
		return new Promise(resolve => resolve('hello world. from the method of post in api1 on workspace at ' + new Date()));
	}
	async put(req, res){
		const i = proc.send({
			cmd: 'notifyRequest',
			message: 'sent message from api1 of put.'
		});
		res.writeHead(200, {'Content-Type': 'text/plain'});
		return new Promise(resolve => resolve('hello world. from the method of put in api1 on workspace at ' + new Date()));
	}
	async delete(req, res){
		const i = proc.send({
			cmd: 'notifyRequest',
			message: 'sent message from api1 of delete.'
		});
		res.writeHead(204, {'Content-Type': 'text/plain'});
		return new Promise((resolve, reject) => {
			reject({
				status: 403,
				message: 'hello world. from the method of delete in api1 on workspace at ' + new Date()
			});
		});
	}
}
if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);
	let numReqs = 0;
	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
	});
	setInterval(async function(){
	}, 300000);
	const messageHandler = (msg) => {
		if (msg.cmd && msg.cmd === 'notifyRequest') {
			numReqs += 1;
			if(msg.message) {
				console.log(msg.message);
			}
		}
	}
	for (const id in cluster.workers) {
		cluster.workers[id].on('message', messageHandler);
	}
} else {
	console.log(`Worker ${process.pid} started`);
	service.run({
		http: {
			port: 9080
		},
		https:{
			port: 9443
		},
		documentRoot: 'D:\\work\\htdocs',
		filters: [filter1, filter2],
		interceptors: [interceptor1, interceptor2],
		api: {
			rest: {
				sample: api1
			}
		},
		customize: {
			IncomingMessage: headers.request,
			ServerResponse: headers.response,
			key: fs.readFileSync(ssl_key),
			cert: fs.readFileSync(ssl_crt)
		}
	});
}
async function filter1(req, res) {
	return new Promise((resolve,reject) => {
		console.log('done filter1');
		console.log(req.token());
		resolve(true);
	});
}
async function filter2(req, res) {
	return new Promise((resolve,reject) => {
		console.log('done filter2');
		res.setCustomizeHeaders();
		resolve(true);
	});
}
function interceptor1(func) {
	return async function(){
		const req = arguments[0];
		const res = arguments[1];
		console.log('execute interceptor1');
		const app = await func.apply(this, arguments);
		console.log('complete interceptor1');
		return app;
	}
}
function interceptor2(func) {
	return async function(){
		const req = arguments[0];
		const res = arguments[1];
		console.log('execute interceptor2');
		const app = await func.apply(this, arguments);
		console.log('complete interceptor2');
		return app;
	}
}
