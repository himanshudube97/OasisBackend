import express from "express";

import { createUser, loginUser, getSingleUser, createBlog, getAllBlogs, getSingleBlog, likeUnlikeBlogs, createComment, getComments, logoutUser, getAllUsers, updateUser } from "../controllers/controllers.js";
import { verifyToken } from "../middleware/validate.js";

const router = express.Router();

router.route("/create-user").post(createUser);
router.route("/login-user").post(loginUser);
router.route("/logout-user").post(verifyToken,logoutUser );
router.route("/get-user/:userId").get(verifyToken, getSingleUser);
router.route("/get-all-users").get(verifyToken, getAllUsers);
router.route("/update-user-profile").post(verifyToken, updateUser);
router.route("/create-blog").post(verifyToken, createBlog);
router.route("/get-all-blogs").get(verifyToken, getAllBlogs);
router.route("/get-single-blog/:blogId").get(verifyToken, getSingleBlog);
router.route("/like-unlike-blog/:blogId").post(verifyToken, likeUnlikeBlogs);
router.route("/create-comment/:blogId").post(verifyToken, createComment);
router.route("/get-comments/:blogId").get(verifyToken, getComments);

export default router;




