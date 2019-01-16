
import { MessageType } from './enums';

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
    canvas: { width: number, height: number };
    config: { 
        r_max: number; 
        r_min: number; 
        i_max: number; 
        i_min: number; 
        max_iter: number; 
        escape: number 
    };
}