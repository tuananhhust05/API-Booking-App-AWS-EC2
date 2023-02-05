import express from "express";
import formData from 'express-form-data';
import { CreatePost } from "../controllers/post.js";
import { GetListPost } from "../controllers/post.js";  
import { GetListPostByUserId } from "../controllers/post.js"; 
import { LikeDislikePostEle } from "../controllers/post.js"; 
import { EditPermissionPost } from "../controllers/post.js";  
import { TagUser } from "../controllers/post.js"; 
import { UnTagUser } from "../controllers/post.js"; 
import { TakeUserTag } from "../controllers/post.js"; 
import { ChangeEmotion } from "../controllers/post.js";  
import { EditPost } from "../controllers/post.js"; 
import { DeleteFilePost } from "../controllers/post.js";   
import { GetListPostByHistory } from "../controllers/post.js"; 
import { GetListPostByHotelName } from "../controllers/post.js";
import { GetListPostRanDomListPostBaned } from "../controllers/post.js";
import { DeletePost } from "../controllers/post.js";
const router = express.Router();
router.post("/DeletePost",formData.parse(),DeletePost)
router.post("/DeleteFilePost",formData.parse(),DeleteFilePost)
router.post("/EditPost",formData.parse(),EditPost)
router.post("/ChangeEmotion",formData.parse(),ChangeEmotion)
router.post("/UnTagUser",formData.parse(),UnTagUser)
router.post("/TakeUserTag",formData.parse(),TakeUserTag)
router.post("/TagUser",formData.parse(),TagUser)
router.post("/EditPermissionPost",formData.parse(),EditPermissionPost)
router.post("/CreatePost",formData.parse(),CreatePost)
router.post("/GetListPostRanDomListPostBaned/HistoryOrder",formData.parse(),GetListPostRanDomListPostBaned)
router.post("/GetListPost/HistoryOrder",formData.parse(),GetListPostByHistory)
router.post("/GetListPostByHotelName/HistoryOrder",formData.parse(),GetListPostByHotelName)
router.get("/GetListPost/:userId",GetListPost)
router.post("/LikeDislikePostEle",formData.parse(),LikeDislikePostEle)
router.get("/GetListPostByUserId/:userId",GetListPostByUserId)
export default router