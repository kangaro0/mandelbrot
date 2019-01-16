"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = __importStar(require("ws"));
var enums_1 = require("./enums");
var list_1 = require("./list");
var currentRow = 0;
var canvas = {
    width: 0,
    height: 0
};
var mandel = {
    r_max: 1.5,
    r_min: -2.5,
    i_max: 1.5,
    i_min: -1.5,
    max_iter: 4096,
    escape: 10
};
var server = new WebSocket.Server({ port: 9030 });
var peers = new list_1.List(0);
server.on('connection', function (ws) {
    var id = guid();
    ws.on('message', function (data) {
        var message = JSON.parse(data);
        if (message.type === enums_1.MessageType.CONFIGURATION) {
            console.log('Client: Received configuration details');
            var content = message.content;
            canvas = content;
            setupMandelbrot();
        }
        else if (message.type === enums_1.MessageType.ROW) {
            var result = message.content;
            var forward = {
                type: enums_1.MessageType.ROW,
                content: result
            };
            peers.get(0).ws.send(JSON.stringify(forward));
            if (currentRow >= canvas.height) {
                handleRowsDone();
            }
            var response = {
                type: enums_1.MessageType.TASK,
                content: createTaskInfo()
            };
            ws.send(JSON.stringify(response));
        }
    });
    ws.on('close', function (code, reason) {
        peers.removeById(id);
        console.log('Peer disconnected.');
    });
    peers.push({
        id: id,
        ws: ws
    });
    if (peers.length() > 1) {
        var message = {
            type: enums_1.MessageType.TASK,
            content: createTaskInfo()
        };
        ws.send(JSON.stringify(message));
    }
    console.log('Peer connected');
});
function createTaskInfo() {
    var task = {
        row: currentRow,
        canvas: canvas,
        config: mandel
    };
    currentRow++;
    return task;
}
function setupMandelbrot() {
    var aspect = canvas.width / canvas.height;
    var width = (mandel.i_max - mandel.i_min) * aspect;
    var r_mid = (mandel.r_max + mandel.r_min) / 2;
    mandel.r_min = r_mid - width / 2;
    mandel.r_max = r_mid + width / 2;
}
function handleRowsDone() {
    var x = canvas.width * 0.51;
    var y = canvas.height * 0.53;
    var w = mandel.r_max - mandel.r_min;
    var h = mandel.i_min - mandel.i_max;
    var cr = mandel.r_min + ((w * x) / canvas.width);
    var ci = mandel.i_max + ((h * y) / canvas.height);
    var zoom = 2.1;
    mandel.r_min = cr - w / zoom;
    mandel.r_max = cr + w / zoom;
    mandel.i_max = ci - h / zoom;
    mandel.i_min = ci + h / zoom;
    currentRow = 0;
}
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
//# sourceMappingURL=main.js.map