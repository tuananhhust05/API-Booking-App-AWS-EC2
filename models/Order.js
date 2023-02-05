import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    HotelId: {
      type: String,
      required: true,
    },
    HotelName: {
      type: String,
      required: true,
    },
    CategoryRoomId: {
      type: String,
      required: true,
    },
    CategoryRoomDesc: {
      type: String,
      required: true,
    },
    RoomNumber: {
      type: String,
      required: true,
    },
    IdRoomNumber: {
      type: String,
      required: true,
    },
    UserOrderId: {
      type: String,
      required: true,
    },
    DateOrder:{
      type: Date,
      required: true,
    },
    OwnerId: {
      type: String,
      required: true,
    },
    PhoneUserOrder: {
      type: String,
      required: true,
    },
    NameUserOrder:{
      type: String,
      required: true,
    },
    EmailUserOrder: {
      type: String,
      required: true,
    },
    ImgUserOrder: {
      type: String,
      required: true,
    },
    PhoneContactExtra:{
      type: String,
      required: true,
    },
    LastDayServe:{
      type: Date,
      required: true,
    },
    FirstDayServe:{
      type: Date,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    Status:{
      type: String,
      required: true,
    }
  },
  { 
    collection: 'Orders',  // cài đặt tên cho conversations kết nối đến 
    versionKey: false   // loai bo version key  
  }  
);

export default mongoose.model("Order", OrderSchema);