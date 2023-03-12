const io = require('socket.io')(8080, {
    cors: {
        origin: "http://localhost:3000",
    }
});

let activeUsers = [];

io.on("connection", (socket) => {
    //add New user
    socket.on("new-user-add", (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id,
            })
        }
        console.log("new User connected", activeUsers);
        io.emit("get-users", activeUsers);
    });
    //send Message
    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
        console.log(user);
        console.log("Sending from socket to", data);
        console.log("Data", data);
        io.to(user.socketId).emit("receive-message", data);
    })

    //remove User
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User disconnected!", activeUsers);
        io.emit("get-Users", activeUsers);
    })
})