import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type:String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    about: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},
    { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);