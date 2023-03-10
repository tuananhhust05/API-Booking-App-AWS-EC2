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
import {verifyAdmin} from "../utils/verifyToken.js"
const router = express.Router();

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
router.post("/DeclineHotelRequest",formData.parse(),DeclineHotelRequest);
router.post("/AcceptHotelRequest",formData.parse(), AcceptHotelRequest);
router.post("/GetListHotelRequest",formData.parse(), GetListHotelRequest);
router.post("/SaveRequestCreateHotel", SaveRequestCreateHotel);
router.get("/TakeHotelRecommend/:userId",TakeHotelRecommend);
router.post("/TakeListHotelInCity", TakeListHotelInCity);
router.post("/TakeDataCity",TakeDataCity);
router.get("/GetListCityBySortCountHotel",GetListCityBySortCountHotel);
router.post("/DeleteFile",formData.parse(), DeleteFile);
//CREATE
router.post("/", verifyAdmin, createHotel); 
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
router.get("/", getHotels); // l???y 4 kh??ch s???n th???a m??n query 

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
router.get("/gethotelbyowner/:id", getHotelByOwner);
router.post("/getImgLocationHotel",formData.parse(),getImgLocationHotel);
router.post("/UpLoadFile",upload2.any("files"),UpLoadFile);
router.get("/AddNameHotelNovn",AddNameHotelNovn);
export default router;