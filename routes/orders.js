import express from "express";
import formData from 'express-form-data';
import { TakeOrderByOwnerId } from "../controllers/order.js"; 
import { TakeUnAvailableDateByOrderRoomId } from "../controllers/order.js";
import { CountOrderByOwnerId } from "../controllers/order.js";
import { SumOrderByOwnerIdBefore } from "../controllers/order.js";
import { SumOrderByOwnerIdAfter } from "../controllers/order.js";
import { TakeInComeSixMonthLatest } from "../controllers/order.js"; 
import { TakeOrderByUserIdOrder } from "../controllers/order.js"; 
import { CreateOrder } from "../controllers/order.js"; 
import { TakeOrderById } from "../controllers/order.js"; 
import { ChangeStatusOrder } from "../controllers/order.js";
const router = express.Router();
router.get("/takelistorderbyownerid/:page/:id/:category", TakeOrderByOwnerId)
router.get("/TakeUnAvailableDateByOrderRoomId/:id", TakeUnAvailableDateByOrderRoomId)  
router.get("/countorderbyownerid/:id", CountOrderByOwnerId)
router.get("/SumOrderByOwnerIdBefore/:id", SumOrderByOwnerIdBefore) 
router.get("/SumOrderByOwnerIdAfter/:id", SumOrderByOwnerIdAfter)  
router.get("/TakeInComeSixMonthLatest/:id", TakeInComeSixMonthLatest)
router.get("/TakeOrderByUserIdOrder/:UserId/:token", TakeOrderByUserIdOrder)
router.get("/TakeOrderById/:id",TakeOrderById)
router.post("/CreateOrder",formData.parse(),CreateOrder)
router.post("/ChangeStatusOrder",formData.parse(),ChangeStatusOrder)
export default router