import express from "express";
import formData from 'express-form-data';
import {
    getListConvByUserId,
    ReadMessage,
    LoadMessage,
    SendMessage,
    DeleteMessage,
    CreateConv
} from "../controllers/conversations.js";

const router = express.Router();

router.post("/getListConvByUserId",formData.parse(), getListConvByUserId);
router.post("/ReadMessage",formData.parse(), ReadMessage);
router.post("/LoadMessage",formData.parse(), LoadMessage);
router.post("/SendMessage",formData.parse(), SendMessage);
router.post("/CreateConv",formData.parse(), CreateConv);
router.get("/DeleteMessage/:messageId/:conversationId", DeleteMessage);
export default router;