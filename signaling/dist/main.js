"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
const enums_1 = require("./enums");
const list_1 = require("./list");
let sockets = new list_1.List(1);
let server = new WebSocket.Server({ port: 9030 });
server.on('connection', (ws) => {
    let id = generateGuid();
    console.log('Incoming Websocket Connection: ' + id);
    ws.on('message', (s) => {
        let message = JSON.parse(s);
        // Handle connection
        if (message.type === enums_1.MessageType.CONNECT && (typeof message.content).localeCompare('string')) {
            let peer = { id: id, ws: ws };
            message.content.localeCompare('server') === 0 ? sockets.set(0, peer) : sockets.push(peer);
            ws.send({
                from: null,
                to: id,
                type: enums_1.MessageType.CONNECT,
                content: null
            });
        }
        else if (message.type === enums_1.MessageType.DISCONNECT) {
            console.log('Signaling done: ' + id);
            ws.terminate();
        }
        else if (message.type === enums_1.MessageType.MESSAGE) {
            // Server connected?
            let server = sockets.get(0);
            if (server == null)
                return;
            // All message from server should go to specific client
            if (server.id.localeCompare(id) === 0) {
                let peer = sockets.getById(message.to);
                if (!peer)
                    return;
                peer.ws.send(message);
            }
            else {
                let peer = sockets.get(0);
                peer.ws.send(message);
            }
        }
        else {
            ws.send(JSON.stringify({
                from: null,
                to: null,
                type: enums_1.MessageType.ERROR,
                content: "Method not found."
            }));
        }
    });
    ws.on('close', (code, reason) => {
        // Remove peer from peerlist
        sockets.removeById(id);
    });
});
server.on('close', () => {
});
server.on('error', () => {
});
function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
