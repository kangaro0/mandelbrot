import { w3cwebsocket } from "websocket";
import { TaskInfo, Message } from "./interfaces";
import { MessageType } from "./enums";

let socket = new w3cwebsocket( 'ws://192.168.0.85:9030' );

socket.onmessage = ( event: MessageEvent ) => {
    let message = JSON.parse( event.data ) as Message;
    let values = calculateRow( message.content as TaskInfo );
    
    let response = {
        type: MessageType.ROW,
        content: {
            row: ( message.content as TaskInfo ).row,
            data: values
        }
    };
    socket.send( JSON.stringify( response ) );
}

function calculateRow( taskInfo: TaskInfo ){
    let config = taskInfo.config;
    let canvas = taskInfo.canvas;
    
    // https://github.com/micschneider  
    let ci = config.i_max + ( config.i_min - config.i_max ) * taskInfo.row / canvas.height;
    let escape = config.escape * config.escape;

    let values = new Array<number>(0);

    for( let i = 0 ; i < canvas.width ; i++ ){
        let cr = config.r_min + ( config.r_max - config.r_min ) * i / canvas.width;
        let zr = 0;
        let zi = 0;
        let tr = 0;
        let ti = 0;
        let n = 0;
        
        for( ; n < config.max_iter && ( tr + ti ) < escape ; ++n ){
            zi = 2 * zr * zi + ci;
            zr = tr - ti + cr;
            tr = zr * zr;
            ti = zi * zi;
        }

        if( n === config.max_iter )
            n = -1;

        values.push( n );
    }
    
    return values;
}