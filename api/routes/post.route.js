import express, { Router } from 'express';
import{ verifyToken} from '../utils/verifyUser.js';
import { createPost,deletePost,getposts,updatePost} from '../controllers/post.controller.js';

const router = express.Router();
router.post("/create-post",verifyToken,createPost)
router.get("/getposts",getposts)
router.delete("/deleteposts/:postId/:userId",verifyToken,deletePost)
router.put("/updateposts/:postId/:userId",verifyToken,updatePost)
export default router;