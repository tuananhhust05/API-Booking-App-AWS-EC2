import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    maxPeople: {
      type: String,
      default: "",
    },
    photos:{
      type: [String],
      default:[]
    },
    desc: {
      type: String,
      default: "",
    },
    Owner: {
      type: String,
      default: "",
    },
    hotelOwner: {
      type: String,
      default: "",
    },
    hotelNameOwn: {
      type: String,
      default: "",
    },
    roomNumbers: [{ number: String, unavailableDates: {type: [Date]}}], // 1 mảng gồm các ngày không thể đăng ký
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);