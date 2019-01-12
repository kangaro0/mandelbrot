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
rtcConnection.onicecandidate = () => {

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

webSocket.onopen( ( event: { target: WebSocket } ) => {

    let ws = event.target;
    let id = '';

    webSocket.onmessage( ( ev: { data: WebSocket.Data, type: string, target: WebSocket } ) => {
        let message = JSON.parse( ev.data ) as Message;

        // Handle connection
        if( message.type === MessageType.CONNECT ){
            id = message.to;
            // Create offer for webrtc signaling
            rtcConnection.createOffer().then( ( v: RTCSessionDescriptionInit ) => {
                // Set current offer as local description
                rtcConnection.setLocalDescription( new RTCSessionDescription( v ) );
                // Prepare signaling offer
                let answer = {
                    from: id,
                    to: null,
                    type: MessageType.MESSAGE,
                    content: v
                };
                ws.send( JSON.stringify( answer ) );
            });
            // Send signaling message
            let anwser = {
                from: id,
                to: null,

            }
        }
        // Handle message
        else if( message.type === MessageType.MESSAGE ){
            // RTCSessionDescription
            if( message.content.sdp ){
                rtcConnection.setRemoteDescription( new RTCSessionDescription( message.content as RTCSessionDescriptionInit ) );
            // RTCIceCandidate
            } else if( message.content.type ){

            }
        }
    });

    let message: Message = {
        from: '',
        to: '',
        type: MessageType.CONNECT,
        content: 'client'
    }
    webSocket.send( JSON.stringify( message ) );
});