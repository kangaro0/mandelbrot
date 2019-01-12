import WebSocket = require( 'ws' );
import { Message } from './interfaces';
import { MessageType } from './enums';

/*
    RTC Connection
*/
let connectionConfig: RTCPeerConnectionConfig = {
    'iceServers': [
        { 'urls': 'stun:stun.stunprotocol.org:3478' },
        { 'urls': 'stun:stun.l.google.com:19302' }
    ]
}

let rtcConnection = new RTCPeerConnection( connectionConfig );

// Events
rtcConnection.onicecandidate = ( rtc: RTCPeerConnection, event: RTCPeerConnectionIceEvent ) => {
    let anwser = {
        from: ids.client,
        to: ids.server,
        content: event.candidate
}
rtcConnection.ondatachannel = () => {
    
}

/*
    WebSocket Connection
*/
interface WebSocketMessage { 
    data?: WebSocket.Data;
    type?: string;
    target: WebSocket;
};
let webSocket = new WebSocket( 'ws://localhost:9030' );
let ids = {
    client: '',
    server: ''
};

webSocket.onopen( ( event: { target: WebSocket } ) => {

    let client = event.target;

    webSocket.onmessage( ( ev: { data: WebSocket.Data, type: string, target: WebSocket } ) => {
        let message = JSON.parse( ev.data ) as Message;

        // Handle connection
        if( message.type === MessageType.CONNECT ){
            ids.client = message.to;
        }
        // Handle message
        else if( message.type === MessageType.MESSAGE ){
            if( ids.server.localeCompare( '' ) === 0 )
                ids.server = message.from;

            // RTCSessionDescription
            if( message.content.sdp ){
                rtcConnection.setRemoteDescription( new RTCSessionDescription( message.content as RTCSessionDescriptionInit ) )
                .then( () => {
                    return rtcConnection.createAnswer();
                })
                .then( ( v: RTCSessionDescriptionInit ) => {
                    // Prepare Anwser
                    let answer = {
                        from: ids.server,
                        to: message.from,
                        type: MessageType.MESSAGE,
                        content: v
                    };
                    webSocket.send( JSON.stringify( answer ) );
                });
            // RTCIceCandidate
            } else if( message.content.candidate ){
                rtcConnection.addIceCandidate( new RTCIceCandidate( message.content.candidate ) )
                .then( () => {
                    return rtcConnection
                });
            }
        }
    });

    let message: Message = {
        from: '',
        to: '',
        type: MessageType.CONNECT,
        content: 'server'
    }
    webSocket.send( JSON.stringify( message ) );
});