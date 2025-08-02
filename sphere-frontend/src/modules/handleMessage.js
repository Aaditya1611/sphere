export const HandleSendMessage = (allMessages, friendId, message) => {

    return {
        ...allMessages,
        [friendId]: [...(allMessages[friendId] || []), message],
    };

};
