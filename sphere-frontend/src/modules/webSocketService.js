import { Client } from '@stomp/stompjs';
//import SockJS from 'sockjs-client';
import SockJS from 'sockjs-client/dist/sockjs';

window.global ||= window;
let stompClient = null;
let isConnected = false;
let subscriptions = [];

export const connectWebSocket = (userId, PrivateMsg, onReadReceipt) => {

    const token = localStorage.getItem("token")

    // 1. Helper function to register all subscriptions
    const registerSubscriptions = () => {

        // Clear old subscriptions to avoid duplicates
        subscriptions.forEach(sub => {
            if (sub && typeof sub.unsubscribe === 'function') {
                sub.unsubscribe();
            }
        });
        subscriptions = [];

        // Subscribe to Private Messages
        const privateSub = stompClient.subscribe('/user/queue/PrivateMessage', (message) => {
            const body = JSON.parse(message.body);
            PrivateMsg?.(body);
        });
        subscriptions.push(privateSub);

        // Subscribe to Read Receipts via private queue
        const receiptSub = stompClient.subscribe(`/user/queue/MessageStatus`, (message) => {
                const body = JSON.parse(message.body);
                onReadReceipt?.(body);
        });
        subscriptions.push(receiptSub);

    };

    // 2. Websocket is ALREADY connected
    // (e.g., user navigated away and came back)
    if (isConnected && stompClient?.connected) {
        registerSubscriptions(); // <--- Run this to attach the NEW callbacks
        return;
    }

    // If already in process of connecting, don't create a new client
    if (stompClient) {
        return;
    }

    // 3. Initial Connection
    const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
    stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
            userId: String(userId)
        }
    });

    try {
        stompClient.onConnect = () => {
            isConnected = true;
            console.log('Connected to WebSocket');

            // Add a small delay to ensure STOMP layer is fully ready
            setTimeout(() => {
                console.log('⏱️ Delaying 100ms to ensure STOMP is ready...');
                registerSubscriptions();
            }, 100);
        };

        stompClient.onDisconnect = () => {
            isConnected = false;
            console.log('Disconnected from WebSocket');
        };

        stompClient.onStompError = (frame) => {
            isConnected = false;
            console.log('STOMP error:', frame);
        };
    } catch (error) {
        console.log("Websocket connection failed", error);
    }

    stompClient.activate();
};

// ... keep your sendPrivateMessage and sendReadReciepts functions as they are ...
export const sendPrivateMessage = (chatMessage) => {
    try {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: "/app/PrivateMessage",
                body: JSON.stringify(chatMessage)
            });
        }
    } catch (error) {
        console.log("failed to send message", error)
    }
}

export const sendReadReciepts = (receipt) => {

    if (!stompClient || !stompClient.connected) return;
    stompClient.publish({
        destination: "/app/MessageStatus",
        body: JSON.stringify(receipt)
    });
}