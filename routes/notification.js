import express from "express";
import formData from 'express-form-data';
import {
    CreateNotification,
    TakeNotificationByUserId,
    ReadNotification
} from "../controllers/notification.js";

const router = express.Router();
router.post("/CreateNotification",formData.parse(),CreateNotification);
router.get("/TakeNotificationByUserId/:userId",TakeNotificationByUserId);
router.get("/ReadNotification/:notifyId",ReadNotification);
export default router