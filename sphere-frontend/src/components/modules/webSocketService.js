import { Client } from '@stomp/stompjs';
//import SockJS from 'sockjs-client';
import SockJS from 'sockjs-client/dist/sockjs';

window.global ||= window;
let stompClient = null;
let isConnected = false;

export const connectWebSocket = (userData, PublicMsg, PrivateMsg) => {

    if (isConnected) {
        console.log("Websocket is already connected. Skipping...");
        return
    }

    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        //debug: (str) => console.log(str),
        connectHeaders: {
            firstname: userData?.firstname
        }
    });
    try {
        stompClient.onConnect = () => {
            isConnected = true;
            console.log('Connected to WebSocket')

            // PUBLIC MESSAGES (BROADCAST)
            stompClient.subscribe('/topic/Message', (message) => {
                const body = JSON.parse(message.body);
                PublicMsg?.(body);
            });

            // PRIVATE MESSAGE (BROADCAST)
            stompClient.subscribe('/user/queue/PrivateMessage', (message) => {
                const body = JSON.parse(message.body);
                PrivateMsg?.(body);
            });
        }
    } catch (error) {
        console.log("Websocket connection failed", error)
    }
    stompClient.activate();
};

export const sendMessage = (chatMessage) => {

    try {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: "/app/Message",
                body: JSON.stringify(chatMessage)
            });
        }
    } catch (error) {
        console.log("failed to send message", error)
    }
};

export const sendPrivateMessage = (chatMessage) => {

    try {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: "/app/PrivateMessage",
                body: JSON.stringify(chatMessage)
            });
            console.log("Sending",JSON.stringify(chatMessage))
        }
    } catch (error) {
        console.log("failed to send message", error)
    }
}