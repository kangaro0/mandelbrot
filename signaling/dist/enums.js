"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["CONNECT"] = 0] = "CONNECT";
    MessageType[MessageType["MESSAGE"] = 1] = "MESSAGE";
    MessageType[MessageType["DISCONNECT"] = 2] = "DISCONNECT";
    MessageType[MessageType["ERROR"] = 3] = "ERROR";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
