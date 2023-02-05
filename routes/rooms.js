import express from "express";
import multer from "multer";
import formData from 'express-form-data';
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
  getRoomsByUserId,
  getRoomsByHotelId,
  uploadFilesImgRoom,
  DeleteImgRoom,
  GetArrayDayUnAvailabilityRoomNumber,
  CreateRoomRequest,
  GetListRoomRequest,
  DeclineRoomRequest,
  AcceptRoomRequest
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verifyToken.js";


// config upload img 
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/rooms")
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/GetArrayDayUnAvailabilityRoomNumber/:IdRoomNum",GetArrayDayUnAvailabilityRoomNumber);
router.get("/getroombyuserid/:id", getRoomsByUserId);
router.post("/AcceptRoomRequest",formData.parse(),AcceptRoomRequest);
router.post("/DeclineRoomRequest",formData.parse(),DeclineRoomRequest);
router.post("/GetListRoomRequest",formData.parse(),GetListRoomRequest);
router.post("/CreateRoomRequest",formData.parse(),CreateRoomRequest);
router.get("/getroombyhotelowner/:id", getRoomsByHotelId);
//CREATE
router.post("/:hotelid", verifyAdmin, createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);
// đăng nhập, nhận về token, gửi lên token theo cookies, giải mã token lấy dữ liệu vf đối chiếu xem có phải admin hay k 
router.put("/:id", updateRoom);
//DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
//GET
router.get("/:id", getRoom);
//GET ALL
router.get("/", getRooms);
// IMAGE
router.post("/update/imgroom",upload.any("files"),uploadFilesImgRoom);
router.post("/update/DeleteImgRoom",formData.parse(),DeleteImgRoom);
// CreateRoomRequest
export default router;