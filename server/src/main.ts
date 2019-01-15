
import * as WebSocket from 'ws';
import { Message, Peer, DisplayInfo, WorkerResult, TaskInfo } from './interfaces';
import { MessageType } from './enums';
import { List } from './list';

/*
    State
*/
let currentRow = 0;
let canvasConfiguration = {
    width: 0,
    height: 0
};
let mandelConfiguration = {
    // x-Achse
    r_max: 1.5,
    r_min: -2.5,
    // y-Achse
    i_max: 1.5,
    i_min: -1.5,
    // Maximum Iterationen
    max_iter: 1024,
    // Ueberpruefe ob Mandelbrot
    escape: 100
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
            let content = message.content as DisplayInfo;
            canvasConfiguration = content;
        }
        // Handle row message
        else if( message.type === MessageType.ROW ){
            let content = message.content as WorkerResult;
            // Send row to client
            peers.get( 0 ).ws.send( content );

            // Check if still work to do
            if( currentRow < canvasConfiguration.height ){
                // Create next task for worker
                let task = createTaskInfo();
                ws.send( task );
            }
        }
    });

    // Push current client to peers
    // Hack: Display client has to connect first!
    peers.push({
        id: id,
        ws: ws
    });
});

function createTaskInfo(): TaskInfo {
    // Create task
    let task = {
        row: currentRow,
        width: canvasConfiguration.width,
        config: mandelConfiguration
    }
    // Increment row
    currentRow++;
    return task;
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