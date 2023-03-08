import express from "express";
import formData from 'express-form-data';
import multer from "multer";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  checkUser,
  verifyUserCheck,
  TakeListUserOrderByOwnerId,
  CountListUserOrderByOwnerId,
  TakeInforUserByMail,
  TakeUserInfoByListId,
  TakeHistorySearch,
  SaveHistorySearch,
  UpdateUserNameNoVn,
  FindUser,
  UploadAvartar
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

// config upload img 
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatarUser")
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})
const upload = multer({ storage: storage });

// router.get("/checkauthentication", verifyToken, (req,res,next)=>{
//   res.send("hello user, you are logged in")
// })

// router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
//   res.send("hello user, you are logged in and you can delete your account")
// })

// router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
//   res.send("hello admin, you are logged in and you can delete all accounts")
// })
// router.get("/", verifyAdmin, getUsers);

router.post("/UploadAvartar",upload.any("files"),UploadAvartar); 
router.post("/FindUser",formData.parse(),FindUser); 
router.get("/UpdateUserNameNoVn", UpdateUserNameNoVn) 
router.post("/TakeUserInfoByListId",TakeUserInfoByListId); 
router.get("/verify", verifyUserCheck); 
router.put("/:id", updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/:id", getUser);
router.put("/check/:id",checkUser);
router.get("/takelistuserorderedbyownerid/:id", TakeListUserOrderByOwnerId)
router.get("/countlistuserorderedbyownerid/:id", CountListUserOrderByOwnerId)
router.get("/takeinforuserbymail/:email", TakeInforUserByMail)
router.get("/TakeHistorySearch/:userId", TakeHistorySearch)  
router.post("/SaveHistorySearch",formData.parse(), SaveHistorySearch)
router.get("/",  getUsers);
export default router;