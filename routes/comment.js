import express from "express";
import formData from 'express-form-data';
import {
    TakeCommentByHotelId,
    CreateCommentHotel,
    LikeDislikeCommentHotel,
    EditCommentHotel,
    DeleteCommentHotel,
    TakeCommentByRoomIdHotelId,
    CommentRoom,
    EditCommentRoom,
    DeleteCommentRoom,
    LikeDislikeCommentRoom,
    CreateCommentPersonalPage,
    TakeListCommentPersonalPage,
    LikeDislikeCommentPersonalPage,
    EditCommentPersonalPage,
    DeleteCommentPersonalPage,
    TakeListUserCare,
    takeListCommentPost,
    CreateCommentPost,
    EditCommentPost,
    LikeDislikePost,
    DeleteCommentPost
} from "../controllers/comment.js";

const router = express.Router();
router.get("/TakeCommentByHotelId/:hotelId", TakeCommentByHotelId);
router.post("/CreateCommentHotel", CreateCommentHotel);
router.post("/LikeDislikeCommentHotel", LikeDislikeCommentHotel);
router.post("/EditCommentHotel",formData.parse(), EditCommentHotel);
router.post("/DeleteCommentHotel",formData.parse(), DeleteCommentHotel);

// comment room 
router.post("/CommentRoom",formData.parse(),CommentRoom);
router.post("/TakeCommentByRoomIdHotelId",formData.parse(),TakeCommentByRoomIdHotelId);
router.post("/EditCommentRoom",formData.parse(),EditCommentRoom);
router.post("/DeleteCommentRoom",formData.parse(),DeleteCommentRoom);
router.post("/LikeDislikeCommentRoom",formData.parse(),LikeDislikeCommentRoom);

// comment personal page 
router.post("/CreateCommentPersonalPage",formData.parse(),CreateCommentPersonalPage);
router.post("/EditCommentPersonalPage",formData.parse(),EditCommentPersonalPage);
router.post("/LikeDislikeCommentPersonalPage",formData.parse(),LikeDislikeCommentPersonalPage);
router.get("/TakeListCommentPersonalPage/:userIdHostPage",TakeListCommentPersonalPage);
router.post("/DeleteCommentPersonalPage",formData.parse(),DeleteCommentPersonalPage);

// take list user care 
router.post("/TakeListUserCare",formData.parse(),TakeListUserCare);

// comment post LikeDislikePost
router.get("/takeListCommentPost/:IdPost",takeListCommentPost);
router.post("/CreateCommentPost",formData.parse(),CreateCommentPost);
router.post("/EditCommentPost",formData.parse(),EditCommentPost);
router.post("/LikeDislikePost",formData.parse(),LikeDislikePost);
router.post("/DeleteCommentPost",formData.parse(),DeleteCommentPost);
export default router;