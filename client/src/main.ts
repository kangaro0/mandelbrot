import { w3cwebsocket } from "websocket";
import { MessageType } from "./enums";
import { Message, WorkerResult } from "./interfaces";

/*
    State
*/
let generation = 0;
let then = Date.now();

/*
    Page
*/
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let palette: Array<Array<number>> = [];

// Handle page load
window.onload = () => {
    canvas = document.getElementById( 'canvas' ) as HTMLCanvasElement;
    context = canvas.getContext( '2d' ) as CanvasRenderingContext2D;

    makePalette();

    // Send configuration message
    let message = {
        type: MessageType.CONFIGURATION,
        content: {
            width: canvas.clientWidth,
            height: canvas.clientHeight
        }
    };
    socket.send( JSON.stringify( message ) );
}

function makePalette(){
    function wrap( x: number ){
        x = ((x + 256) & 0x1ff) - 256;
        if( x < 0 )
            x = -x;
        return x;
    }
    for( let i = 0 ; i <= 1024 ; i++ )
        palette.push([wrap(7*i),wrap(5*i),wrap(11*i)]);
}

function drawRow( result: WorkerResult ){
    let row = context.createImageData( canvas.clientWidth, 1 );
    let pixels = row.data;

    let values = result.data;
    for( let i = 0 ; i < row.width ; i++ ){
        let r = i * 4;
        let g = i * 4 + 1;
        let b = i * 4 + 2;
        let a = i * 4 + 3;

        pixels[a] = 255;

        if( values[ i ] < 0 )
            pixels[ r ] = pixels[ g ] = pixels[ b ] = 0;
        else{
            let c = palette[ values[ i ] ];
            pixels[ r ] = c[ 0 ];
            pixels[ g ] = c[ 1 ];
            pixels[ b ] = c[ 2 ];
        }
    }

    context.putImageData( row, 0, result.row );
}

/*
    WebSocket
*/
let socket = new w3cwebsocket( 'ws://localhost:9030' );

socket.onopen = () => {
    console.log( 'WebSocket-Connection established' );
}

socket.onmessage = ( event: MessageEvent ) => {
    let message = JSON.parse( event.data ) as Message;
    let content = message.content as WorkerResult;

    if( content.row === canvas.clientHeight - 1 ){
        console.log( 'Generation: ' + generation );
        let now = Date.now();
        console.log( 'Time elapsed: ' + ( then - now ) / 1000 + ' s' );
        then = now;
        generation++;
    }

    drawRow( content );
}