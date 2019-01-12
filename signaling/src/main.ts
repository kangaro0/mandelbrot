
import * as WebSocket from 'ws';
import { Message, Peer } from './interfaces';
import { MessageType } from './enums';
import { List } from './list';

let sockets = new List<Peer>(1);
let server = new WebSocket.Server({ port: 9030 });

server.on( 'connection', ( ws: WebSocket ) => {

    let id = generateGuid();

    console.log( 'Incoming Websocket Connection: ' + id );

    ws.on( 'message', ( s: string ) => {
        let message = JSON.parse( s ) as Message;

        // Handle connection
        if( message.type === MessageType.CONNECT && ( typeof message.content ).localeCompare( 'string' ) ){ 
            let peer: Peer = { id: id, ws: ws };
            message.content.localeCompare( 'server' ) === 0 ? sockets.set( 0, peer ) : sockets.push( peer );
            ws.send({
                from: null,
                to: id,
                type: MessageType.CONNECT,
                content: null
            });
        } 
        else if( message.type === MessageType.DISCONNECT ){
            console.log( 'Signaling done: ' + id );
            ws.terminate();
        }
        // Handle messages
        else if( message.type === MessageType.MESSAGE ){
            // Server connected?
            let server = sockets.get( 0 );
            if( server == null )
                return;

            if( server.id.localeCompare( id ) === 0 ){
                let peer = sockets.getById( message.to );
                peer.ws.send( message );
            }
        }
        // Handle error
        else {
            ws.send(JSON.stringify({ 
                from: null, 
                to: null, 
                type: MessageType.ERROR, 
                content: "Method not found." }) 
            );
        }
    });
});

server.on( 'close', () => {
    
});

server.on( 'error', () => {

});

function generateGuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
