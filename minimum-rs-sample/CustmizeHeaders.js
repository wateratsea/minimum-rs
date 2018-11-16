const http = require('http');

module.exports.request = class RequestHeaders extends http.IncomingMessage {
    token(){
        return this.headers['x-requested-by'] || null;
    }
}
module.exports.response = class ResponseHeaders extends http.ServerResponse {
    setCustomizeHeaders(){
        this.setHeader('page-key', Math.random().toString(36).slice(-10));
    }
}
