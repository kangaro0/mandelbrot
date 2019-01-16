
import * as WebSocket from 'ws';
import { MessageType } from './enums';

export interface Peer {
    id: string;
    ws: WebSocket;
}

export interface Message {
    type: MessageType;
    content: WorkerResult;
}

export interface WorkerResult {
    row: number;
    data: Array<number>;
}

export interface DisplayInfo {
    width: number;
    height: number;
}