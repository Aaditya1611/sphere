import { Client } from '@stomp/stompjs';
//import SockJS from 'sockjs-client';
import SockJS from 'sockjs-client/dist/sockjs';

window.global ||= window;
let stompClient = null;

export const connectWebSocket = (onMessageRecevied) => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str)
    });

    stompClient.OnConnect = () => {
        console.log('Connected to WebSocket');

        stompClient.subscribe('/topic/Message', (msg) => {
            const message = JSON.parse(msg.body);
            onMessageRecevied(message);
        });
    };

    stompClient.activate();

};

export const sendMessage = (chatMessage) => {

    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/Message",
            body: JSON.stringify(chatMessage)
        });
    }
};