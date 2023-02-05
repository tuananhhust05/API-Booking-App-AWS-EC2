import mongoose from "mongoose";
const RoomCreateRequestSchema = new mongoose.Schema({
  hotelOwner: {
    type: String,
    default:""
  },
  Owner:{
    type: String,
    default:""
  },
  desc: {
    type: String,
    default:""
  },
  price: {
    type: String,
    default:""
  },
  title: {
    type: String,
    default:""
  },
  maxPeople: {
    type: String,
    default:""
  },
  roomNumbers: {
    type: [String],
    default:[""]
  },
  hotelNameOwn: {
    type: String,
    default: "",
  },
  photos: {
    type: [String],
    default:["https://anduc.edu.vn/canh-dep-thien-nhien-the-gioi/imager_6209.jpg"]
  }
});

export default mongoose.model("RoomCreateRequest", RoomCreateRequestSchema)