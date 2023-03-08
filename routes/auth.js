import express from "express";
import { login, register,
        loginmail, changePass,registeradmin,RegisterOtpMail,VerifyOtpMail
     } from "../controllers/auth.js";
import formData from 'express-form-data';
const router = express.Router();
router.post("/VerifyOtpMail",formData.parse(),VerifyOtpMail)
router.post("/RegisterOtpMail",formData.parse(),RegisterOtpMail)
router.post("/registeradmin",registeradmin)
router.post("/loginmail", loginmail)
router.post("/register", register)
router.post("/login", login)
router.post("/changePass", changePass);
export default router