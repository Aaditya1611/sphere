import { Client } from '@stomp/stompjs';
//import SockJS from 'sockjs-client';
import SockJS from 'sockjs-client/dist/sockjs';

window.global ||= window;
let stompClient = null;
let isConnected = false;
let subscriptions = [];
const userId = localStorage.getItem("userId")
let userFirstname = null;  // Store the firstname for STOMP subscriptions

export const connectWebSocket = (userData, PrivateMsg, onReadReceipt) => {

    // Store firstname for later use in subscriptions (trim whitespace)
    console.log("🔗 WebSocket connecting with firstname:", userFirstname);

    // 1. Helper function to register all subscriptions
    const registerSubscriptions = () => {
        console.log("📋 Registering subscriptions... userFirstname =", userFirstname);
        
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
        console.log("✓ Subscribed to /user/queue/PrivateMessage");

        // Subscribe to Read Receipts via private queue
        if (onReadReceipt) {
            const receiptPath = `/user/${userId}/queue/read-messages`;  // Spring STOMP automatically routes this to the current user
            console.log("📨 Subscribing to:", receiptPath);
            const receiptSub = stompClient.subscribe(receiptPath, (message) => {
                console.log("📩 ⬅️ CALLBACK TRIGGERED! Message received on:", receiptPath);
                try {
                    const body = JSON.parse(message.body);
                    console.log("🎯 Parsed body:", body);
                    console.log("🔔 About to call onReadReceipt with:", body);
                    onReadReceipt(body);
                    console.log("✅ onReadReceipt called successfully");
                } catch (e) {
                    console.error("❌ Error processing receipt:", e);
                }
            });
            subscriptions.push(receiptSub);
            console.log("✓ Subscribed to read receipts");
        } else {
            console.log("⚠️ Cannot subscribe to receipts: onReadReceipt =", !!onReadReceipt);
        }
    };

    // 2. CASE A: Websocket is ALREADY connected
    // (e.g., user navigated away and came back)
    if (isConnected && stompClient?.connected) {
        console.log("Websocket already connected. Refreshing subscriptions...");
        registerSubscriptions(); // <--- Run this to attach the NEW callbacks
        return;
    }

    // If already in process of connecting, don't create a new client
    if (stompClient) {
        console.log("⏳ WebSocket connection already in progress...");
        return;
    }


    // 3. CASE B: Initial Connection
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
            firstname: userData?.firstname
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
    if(!stompClient || !stompClient.connected) return;

    stompClient.publish({
        destination: "/app/read-messages",
        body: JSON.stringify(receipt)
    });
}