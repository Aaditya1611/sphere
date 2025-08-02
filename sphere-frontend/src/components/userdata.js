export const UserData = {

    id: "user123",
    name: "Aaditya Raj"
};

export const Friends = [

    {
        id: "friend1",
        name: "Harsh Kumar",
        userEmail: "HarshKumar98@gmail.com",
        bio: "Hey there, i am a Python developer",
        lastmessage: "Hey Aaditya!"
    },

    {
        id: "friend2",
        name: "Rishabh Raj",
        userEmail: "RishabhRaj45@gmail.com",
        bio: "Hii i am Rishabh and i am a Game developer",
        lastmessage: "Hey, Aadi"
    }
];

export const Messages = {

    friend1: 
    [
        {
            sender: "user123",
            text: "Hey, Harsh",
            timestamp: "10:10 am"
        },
        {
            sender: "friend1",
            text: "Hii Aaditya, How are you?",
            timestamp: "10:20 am"
        },
        
    ],
    friend2:
    [
        {
            sender: "user123",
            text: "Hey Rishabh",
            timestamp: "12:30 am"
        },
        {
            sender: "friend2",
            text: "Hey Aaditya, How's your day?",
            timestamp: "12:34 am"
        }
    ]


}