import * as WebSocket from 'ws';
import { MessageType } from "./enums";

export interface Message {
    from: string;
    to: string;
    type: MessageType;
    content: any;
}

export interface Peer {
    id: string;
    ws: WebSocket;
}