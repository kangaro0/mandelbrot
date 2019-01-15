
import * as WebSocket from 'ws';
import { MessageType } from './enums';

export interface Peer {
    id: string;
    ws: WebSocket;
}

export interface Message {
    type: MessageType;
    content: WorkerResult | DisplayInfo | TaskInfo ;
}

export interface WorkerResult {
    row: number;
    data: Array<number>;
}

export interface DisplayInfo {
    width: number;
    height: number;
}

export interface TaskInfo {
    row: number;
    width: number;
    config: { 
        r_max: number; 
        r_min: number; 
        i_max: number; 
        i_min: number; 
        max_iter: number; 
        escape: number 
    };
}