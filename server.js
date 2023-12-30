import { config } from "dotenv";
config();
import express from "express";
const app = express();
import morgan from "morgan";


import cors from "cors";
import { createServer } from "http";
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

app.get("/", (req, res)=>{
    res.json({
        "message": "yooo"
    })
})
app.get("/delete", async(req, res)=>{
    await UserModel.deleteMany({});
})
server.listen(4000, ()=>{
    console.log("server listening to port 4000")
})