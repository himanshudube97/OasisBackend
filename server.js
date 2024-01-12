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

io.on("connection", async (socket)=>{
    console.log(socket);
})


// app.get("/delete", async(req, res)=>{
//     await UserModel.deleteMany({});
// })
server.listen(4000, () => {
    console.log("server listening to port 4000")
})