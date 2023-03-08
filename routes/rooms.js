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
  AcceptRoomRequest,
  AddRoomNumber,
  DeleteRoomNumber
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verifyToken.js";

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
router.post("/DeleteRoomNumber",formData.parse(),DeleteRoomNumber);
router.post("/DeclineRoomRequest",formData.parse(),DeclineRoomRequest);
router.post("/GetListRoomRequest",formData.parse(),GetListRoomRequest);
router.post("/CreateRoomRequest",formData.parse(),CreateRoomRequest);
router.post("/AddRoomNumber",formData.parse(),AddRoomNumber);
router.get("/getroombyhotelowner/:id", getRoomsByHotelId);
router.post("/:hotelid", verifyAdmin, createRoom);
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", updateRoom);
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
router.get("/:id", getRoom);
router.get("/", getRooms);
router.post("/update/imgroom",upload.any("files"),uploadFilesImgRoom);
router.post("/update/DeleteImgRoom",formData.parse(),DeleteImgRoom);
export default router;