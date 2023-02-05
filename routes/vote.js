import express from "express";
import formData from 'express-form-data';
import { CountCaculateVoteHotel,
    TakeListInforUserVote,
    CountCaculateVoteRoom,
    TakeListInforUserVoteRoom,
    MakeVoteHotel
} from "../controllers/vote.js";

const router = express.Router();

// vote hotel 
router.get("/CountCaculateVoteHotel/:hotelId", CountCaculateVoteHotel)
router.get("/TakeListInforUserVote/:hotelId", TakeListInforUserVote)
router.post("/MakeVoteHotel",formData.parse(), MakeVoteHotel);

// vote rooom 
router.get("/CountCaculateVoteRoom/:roomId",CountCaculateVoteRoom);
router.get("/TakeListInforUserVoteRoom/:roomId",TakeListInforUserVoteRoom);
export default router
