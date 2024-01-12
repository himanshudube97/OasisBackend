import { config } from "dotenv";
config();
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
const app = express();
import morgan from "morgan";


import cors from "cors";
import router from "./routes/routes.js"
import connectDatabase from "./config/config.js";
import { UserModel } from "./model/userModel.js";


connectDatabase(process.env.DB_URI);
const server = createServer(app);
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(morgan("tiny"));
app.use(router);

app.get("/", (req, res) => {
    res.json({
        "message": "yooo"
    })
})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

//initial connect event
io.on("connection", async (socket) => {
    // console.log(socket.handshake, "socket");
    // console.log(socket.handshake.auth, "sockkkkk")
    socket.join(socket.handshake.auth._id);

    socket.emit("connection", "Hey you are connected");

    socket.on("join-chat-room", ({ roomId }) => {
        socket.join(roomId);
    })

    socket.on("pvt-message", (msg) => {
        console.log(msg, "msg")

        const clientsInRoom = io.sockets.adapter.rooms.get(msg.chatId);
        const isMultipleClients = clientsInRoom && clientsInRoom.size > 1;
        console.log(clientsInRoom, "clinets");
        if (isMultipleClients) {
            io.to(msg.chatId).emit("pvt-message", msg);
        }else{
            socket.join(msg.toId);
            io.to(msg.toId).emit("pvt-message", msg);
        }


        // // socket.join(msg.chatId);
        // socket.join(msg.toId)

        // console.log(clientsInRoom, "clinets")
        // if (!isMultipleClients) {
        //     io.to(msg.toId).emit("pvt-message", msg) 

        //     // io.to(msg.chatId).emit("pvt-message", msg)
        // } else {
        //     io.to(msg.toId).emit("pvt-message", msg)
        // }
    })

    socket.on("leave-room", ({ roomId }) => {
        console.log("leaving", roomId)
        socket.leave(roomId)
    })

    //disconnect event
    socket.on("disconnect", (s) => {
        console.log("user got disconnected")
    })

})




// app.get("/delete", async(req, res)=>{
//     await UserModel.deleteMany({});
// })
server.listen(4000, () => {
    console.log("server listening to port 4000")
})