/*
    Connection
*/
let connectionConfig: RTCPeerConnectionConfig = {
    'iceServers': [
        { 'urls': 'stun:stun.stunprotocol.org:3478' },
        { 'urls': 'stun:stun.l.google.com:19302' }
    ]
}

let connection = new RTCPeerConnection( connectionConfig );

// Events
connection.onicecandidate = () => {

}
connection.ondatachannel = () => {
    
}