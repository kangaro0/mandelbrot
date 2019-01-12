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
let sockets = new Array(1);
let server = new WebSocket.Server({ port: 9030 });
server.on('connection', (ws) => {
    console.log('Incoming Websocket Connection: ');
    console.log(ws.upgradeReq.headers[ 'sec-websocket-key' ]);
    ws.on('message', (s) => {
        let message = JSON.parse(s);
        // Handle connection
        if (message.type === enums_1.MessageType.CONNECT) {
            message.from.localeCompare('server') ? sockets[0] = ws : sockets.push(ws);
        }
        else if (message.type === enums_1.MessageType.REQUEST) {
            let peer = sockets[0];
        }
        else if (message.type === enums_1.MessageType.ANSWER) {
            // Get correct peer
        }
    });
});
server.on('close', () => {
});
server.on('error', () => {
});
function start() {
}
