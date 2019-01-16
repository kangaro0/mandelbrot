
import * as WebSocket from 'ws';
import { Message, Peer, DisplayInfo, WorkerResult, TaskInfo } from './interfaces';
import { MessageType } from './enums';
import { List } from './list';

/*
    State
*/
let generation = 0;
let currentRow = 0;
let canvas = {
    width: 0,
    height: 0
};
let mandel = {
    // x-Achse
    r_max: 1.5,
    r_min: -2.5,
    // y-Achse
    i_max: 1.5,
    i_min: -1.5,
    // Maximum Iterationen
    max_iter: 4096,
    // Ueberpruefe ob Mandelbrot
    escape: 10
};

/*
    WebSocket-Server
*/
let server = new WebSocket.Server({ port: 9030 });
let peers = new List<Peer>(0);

server.on( 'connection', ( ws: WebSocket ) => {

    let id = guid();

    // Handle incoming message
    ws.on( 'message', ( data: string ) => {
        let message = JSON.parse( data ) as Message;
        
        // Handle configuration message
        if( message.type === MessageType.CONFIGURATION ){
            console.log( 'Client: Received configuration details' );

            let content = message.content as DisplayInfo;
            canvas = content;

            setupMandelbrot();
        }
        else if( message.type === MessageType.RESET ){
            console.log( 'Client: Reset received.' );
            setupMandelbrot();
        }
        // Handle row message
        else if( message.type === MessageType.ROW ){
            //.log( 'Received row from worker. Sent to client.' );

            let result = message.content as WorkerResult;
            // Send row to client
            let forward = {
                type: MessageType.ROW,
                content: result
            };
            peers.get( 0 ).ws.send( JSON.stringify( forward ) );

            // Check if still work to do
            if( currentRow >= canvas.height ){
                generation++;
                handleRowsDone();
                //console.log( 'Finished image, starting new.' );
            }

            // Create next task for worker
            let response = {
                type: MessageType.TASK,
                content: createTaskInfo()
            };
            ws.send( JSON.stringify( response ) );
        }
    });

    ws.on( 'close', ( code: number, reason: string ) => {
        //peers.removeById( id );
        console.log( 'Peer disconnected.' );
    });

    // Push current client to peers
    // Hack: Display client has to connect first!
    peers.push({
        id: id,
        ws: ws
    });

    if( peers.length() > 1 ){
        let message = {
            type: MessageType.TASK,
            content: createTaskInfo()
        };
        ws.send( JSON.stringify( message ) );
    } 

    console.log( 'Peer connected' );
});

function createTaskInfo(): TaskInfo {
    // Create task
    let task = {
        row: currentRow,
        canvas: canvas,
        config: mandel
    };
    // Increment row
    currentRow++;
    return task;
}

function setupMandelbrot(){
    generation = 0;
    mandel = {
        // x-Achse
        r_max: 1.5,
        r_min: -2.5,
        // y-Achse
        i_max: 1.5,
        i_min: -1.5,
        // Maximum Iterationen
        max_iter: 64,
        // Ueberpruefe ob Mandelbrot
        escape: 10
    };

    let aspect = canvas.width / canvas.height;
    let width = ( mandel.i_max - mandel.i_min ) * aspect;
    let r_mid = ( mandel.r_max + mandel.r_min ) / 2;
    mandel.r_min = r_mid - width / 2;
    mandel.r_max = r_mid + width / 2;
}

function handleRowsDone(){
    let x = canvas.width *  0.5151654;
    let y = canvas.height * 0.5208538;
    if( generation > 14 ){
        x = canvas.width * 0.5;
        y = canvas.height * 0.5;
    }

    let w = mandel.r_max - mandel.r_min;
    let h = mandel.i_min - mandel.i_max;
    let cr = mandel.r_min + (( w * x ) / canvas.width );
    let ci = mandel.i_max + (( h * y ) / canvas.height );

    let zoom = 2.1;

    mandel.r_min = cr - w / zoom;
    mandel.r_max = cr + w / zoom;
    mandel.i_max = ci - h / zoom;
    mandel.i_min = ci + h / zoom;

    currentRow = 0;
}

/* Helper Functions */
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}