import { Client } from '@stomp/stompjs';

const WS_ENDPOINT = 'http://localhost:8080/sphere';

let stompClient = null;

const connect = (onMessageRecieved) => {
    stompClient = new Client({
        brokerURL: WS_ENDPOINT,
        debug: (str) => {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {

        console.log('Connected: ', + frame);
        stompClient.subscribe('/topic/public', (message) => {
            onMessageRecieved(JSON.parse(message.body));
        });

        stompClient.subscribe('/user/queue/messages', (message) => {
            onMessageRecieved(JSON.parse(message.body))
        });
    };

    stompClient.onStompError = (frame) => {
        
        console.error('Broker reported error: ', + frame.headers['message']);
        console.error('Additional details: ', + frame.body);
    };

    stompClient.activate();


}

const sendPrivateMessage = (message) => {

    if(stompClient && stompClient.connected) {
        stompClient.publish({
            destination: '/chat/chat.sendPrivateMessage',
            body: JSON.stringify(message)
        })
    }
}

const sendMessage = (message) => {

    if(stompClient && stompClient.connected) {
        stompClient.publish({
            destination: '/chat/chat.sendMessage',
            body: JSON.stringify(message)
        })
    }
}

const disconnect = () => {

    if(stompClient) {
        stompClient.disconnect();
    }
}

export { connect , sendPrivateMessage , sendMessage , disconnect};