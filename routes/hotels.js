import express from "express";
import multer from "multer";
import formData from 'express-form-data';
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  updateHotel,
  getHotelByOwner,
  uploadFilesImgHotel,
  DeleteImgHotel,
  getImgLocationHotel,
  UpLoadFile,
  DeleteFile,
  GetListCityBySortCountHotel,
  TakeDataCity,
  TakeListHotelInCity,
  TakeHotelRecommend,
  SaveRequestCreateHotel,
  GetListHotelRequest,
  AcceptHotelRequest,
  DeclineHotelRequest,
  AddNameHotelNovn
} from "../controllers/hotel.js";
import Hotel from "../models/Hotel.js";
import {verifyAdmin} from "../utils/verifyToken.js"
const router = express.Router();

// config upload img 
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/hotels")
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})
const upload = multer({ storage: storage });

let storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads")
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})
const upload2 = multer({ storage: storage2 });
// DeclineHotelRequest
router.post("/DeclineHotelRequest",formData.parse(),DeclineHotelRequest);
// AcceptHotelRequest
router.post("/AcceptHotelRequest",formData.parse(), AcceptHotelRequest);
//GetListHotelRequest
router.post("/GetListHotelRequest",formData.parse(), GetListHotelRequest);
// SaveRequestCreateHotel
router.post("/SaveRequestCreateHotel", SaveRequestCreateHotel);
// TakeHotelRecommend
router.get("/TakeHotelRecommend/:userId",TakeHotelRecommend);
// TakeListHotelInCity
router.post("/TakeListHotelInCity", TakeListHotelInCity);
// TakeDataCity
router.post("/TakeDataCity",TakeDataCity);
// GetListCityBySortCountHotel
router.get("/GetListCityBySortCountHotel",GetListCityBySortCountHotel);
// DeleteFile
router.post("/DeleteFile",formData.parse(), DeleteFile);
//CREATE
router.post("/", verifyAdmin, createHotel); // nếu là admin mới cho tạo khách sạn 

// IMAGE
router.post("/update/imghotel",upload.any("files"),uploadFilesImgHotel);
router.post("/update/DeleteImgHotel",formData.parse(),DeleteImgHotel);
//UPDATE
// router.put("/:id", verifyAdmin, updateHotel); 
router.put("/:id", updateHotel); 
//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);
//GET
router.get("/find/:id", getHotel);
//GET ALL

router.get("/", getHotels); // lấy 4 khách sạn thỏa mãn query 

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
router.get("/gethotelbyowner/:id", getHotelByOwner);
router.post("/getImgLocationHotel",formData.parse(),getImgLocationHotel);
router.post("/UpLoadFile",upload2.any("files"),UpLoadFile);
router.get("/AddNameHotelNovn",AddNameHotelNovn);
export default router;