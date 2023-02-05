import express from "express";
import { login, register,
        loginmail, changePass,registeradmin
     } from "../controllers/auth.js";

const router = express.Router();
router.post("/registeradmin",registeradmin)
router.post("/loginmail", loginmail)
router.post("/register", register)
router.post("/login", login)
router.post("/changePass", changePass);
export default router