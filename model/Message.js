import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({

    userOne: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userSecond: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            senderName: { type: String, required: true },
            message: { type: String, trim: true, required: true }
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

},
    { timestamps: true }
);

export const MsgModel = mongoose.model("Message", messageSchema);