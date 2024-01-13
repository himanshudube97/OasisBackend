import { CommentsModel } from "../model/Comments.js";
import { BlogModel } from "../model/Blogs.js";
import { UserModel } from "../model/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MsgModel } from "../model/Message.js";

export const createUser = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await UserModel.findOne({ phone: phone });
        if (user) return res.status(400).json({
            success: false,
            message: "User already exists"
        });

        const result = await UserModel.create({ name, phone });
        res.status(201).json({
            success: true,
            message: "New User Created",
            userId: result._id
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({
            success: false,
            message: "Phone number is required"
        })

        const user = await UserModel.findOneAndUpdate({ phone }, { isLoggedIn: true }, { new: true });
        if (!user) return res.status(400).json({
            success: false,
            message: "No such User found"
        })

        //create a jwt Token
        const payload = {
            name: user.name,
            id: user._id,
            phone: user.phone
        }
        const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY });

        return res.status(200).json({
            success: true,
            message: "User Successfully Logged In",
            data: {
                token,
                user
            }
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
};

export const logoutUser = async (req, res) => {
    const user = req.user;
    try {
        const result = await UserModel.findOneAndUpdate(
            { _id: user.id, },
            { isLoggedIn: false },
            { new: true }
        )
        if (!result) return res.status(400).json({
            success: false,
            message: "User Already Logged Out"
        })

        return res.status(200).json({
            success: true,
            messasge: "User Logged Out"
        })


    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}


export const getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) res.status(400).json({
            success: false,
            message: "provide a userId",
        })

        const user = await UserModel.findOne({ _id: userId });
        if (!user) res.status(400).json({
            success: false,
            message: "No user found with this userId",

        })
        res.status(200).json({
            success: true,
            message: "User fetched Successfully",
            data: user
        })


    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}


export const getAllUsers = async (req, res) => {
    const user = req.user;
    try {
        const users = await UserModel.find({ _id: { $ne: user.id } });
        return res.status(200).json({
            success: true,
            message: "Success",
            data: users
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const updateUser = async (req, res) => {
    const user = req.user;
    try {
        const result = await UserModel.findOneAndUpdate(
            { _id: user.id },
            req.body,
            { new: true }
        )
        if (!result) return res.status(400).json({
            success: false,
            message: "Wrong UserId",
        })
        return res.status(201).json({
            success: true,
            message: "User Successfully Updated",
            data: result
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const createBlog = async (req, res) => {
    const user = req.user;
    try {
        const { title, description, content } = req.body;
        if (!title || !description || !content) res.status(400).json({
            success: false,
            message: "All fields are required"
        })

        const result = await BlogModel.create({
            ...req.body,
            createdBy: user.id
        })
        return res.status(201).json({
            success: true,
            message: "Blog Successfully Created",
            data: result
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const result = await BlogModel.find({});
        const blogCount = await BlogModel.countDocuments({});

        //here only we will check
        res.status(200).json({
            success: true,
            message: "All Rooms",
            data: {
                blogCount,
                blogs: result,
            }
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const getSingleBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!blogId) res.status(400).json({
            success: false,
            message: "Provide a blogId",
        })

        const blog = await BlogModel.findOne({ _id: blogId }).populate("createdBy");

        if (!blog) return res.status(400).json({
            success: false,
            message: "No Blog with such id"
        })

        return res.status(200).json({
            success: true,
            message: "blog",
            data: blog
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
};

export const likeUnlikeBlogs = async (req, res) => {
    const user = req.user;
    try {
        const { blogId } = req.params;
        const { likeBlog } = req.body;
        console.log(likeBlog, "likekee")
        if (!blogId) return res.status(400).json({
            success: false,
            message: "Please provide blogId"
        })

        let updateQuery;
        updateQuery = likeBlog ? { $addToSet: { likes: user.id } } : { $pull: { likes: user.id } }
        const blog = await BlogModel.findOneAndUpdate(
            { _id: blogId },
            updateQuery,
            { new: true } // To return the updated document after the update operation
        );
        if (!blog) return res.status(400).json({
            success: false,
            messasge: "No such blog found"
        });

        return res.status(200).json({
            success: true,
            message: "Blog status changed",
            data: blog
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const createComment = async (req, res) => {
    const user = req.user;
    try {
        const { blogId } = req.params;
        const { comment } = req.body;
        console.log(req.body);
        if (!blogId || !comment) return res.status(400).json({
            success: false,
            message: "Please provide blogId and comment"
        });

        const result = await CommentsModel.create({
            comment,
            blogId,
            createdBy: user.id
        });

        return res.status(201).json({
            success: true,
            message: "Blog Successfully Created",
            data: result
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}


export const getComments = async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!blogId) return res.status(400).json({
            success: false,
            message: "blog id is required"
        })
        const comments = await CommentsModel.find({ blogId }).populate("createdBy").sort("desc");
        res.status(200).json({
            success: true,
            message: "Success fully fetched",
            data: comments
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}


export const followUnfollowUser = async (req, res) => {
    const user = req.user;
    const session = await mongoose.startSession();
    try {
        const { userId } = req.params;
        const { isFollow } = req.body;
        if (!userId) return res.status(400).json({
            success: false,
            message: "Please provide userId"
        });
        const ifMsgSectionExists = await MsgModel.findOne({
            $or: [
                { userOne: user.id, userSecond: userId },
                { userOne: userId, userSecond: user.id }
            ]
        });
        console.log(ifMsgSectionExists, "ifdfdsfdsfdf")
        let updateQueryFollower;
        let updateQueryFollowing;
        updateQueryFollower = isFollow ? { $addToSet: { followers: userId } } : { $pull: { followers: userId } };
        updateQueryFollowing = isFollow ? { $addToSet: { following: userId } } : { $pull: { following: userId } };


        session.startTransaction();

        const updateFollower = await UserModel.findOneAndUpdate(
            { _id: user.id },
            updateQueryFollowing,
            { new: true }
        );
        const updateFollowing = await UserModel.findOneAndUpdate(
            { _id: userId },
            updateQueryFollower,
            { new: true }
        );
        let resp;
        if (!ifMsgSectionExists) {
            resp = await MsgModel.create({
                userOne: user.id,
                userSecond: userId,
                createdBy: user.id
            });
            console.log(resp, "resppp")
            if (!resp) throw new Error("some error")
        }

        console.log(updateFollower, updateFollowing, "total")
        const finalRes = await Promise.all([updateFollower, updateFollowing,])
        console.log(finalRes, "finalrs")
        if (!finalRes) {
            throw new Error("Some issue in updating either the User being followed or follower");
        }

        await session.commitTransaction();
        return res.status(201).json({
            success: true,
            message: "Success",
            data: updateFollower
        })


    } catch (error) {
        console.log(error, "error")
        await session.abortTransaction();
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    } finally {
        await session.endSession();
    }
}


export const getAllChats = async (req, res) => {
    const userOne = req.user.id;
    console.log(userOne, "user")
    try {
        const { userId: userSecond } = req.params;
        if (!userOne || !userSecond) return res.status(400).json({
            success: false,
            message: "User Ids are missing, both userIds are required"
        })
        const resp = await MsgModel.findOne({
            $or: [
                { userOne: userOne, userSecond: userSecond },
                { userOne: userSecond, userSecond: userOne }
            ]
        });
        console.log(resp, "respons")
        if (!resp) return res.status(400).json({
            success: false,
            message: "No Message Section found",

        })
        return res.status(200).json({
            success: true,
            message: "Successfully fetched",
            data: resp
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const getMyChats = async (req, res) => {
    const userId = req.user.id;
    try {

        const resp = await MsgModel.find({
            $or: [
                { userOne: userId },
                { userSecond: userId }
            ]
        });
        console.log(resp, "rsponsive");
        if (!resp) return res.status(400).json({
            success: false,
            message: "No Message Section found",

        })
        return res.status(200).json({
            success: true,
            message: "Successfully fetched",
            data: resp
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}