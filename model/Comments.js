import mongoose from "mongoose"
const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

},
    { timestamps: true }
);

export const CommentsModel = mongoose.model("Comments", commentsSchema);