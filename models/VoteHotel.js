import mongoose from "mongoose";
const VoteHotelSchema = new mongoose.Schema(
  {
    HotelId: {
      type: String,
      default:"",
    },
    UserId: {
      type: String,
      default :""
    },
    Vote: {
      type: Number,
      default :5
    },
  },
  { collection: 'VoteHotels',  // cài đặt tên cho conversations kết nối đến 
    versionKey: false   // loai bo version key  
   }    
);

export default mongoose.model("VoteHotels", VoteHotelSchema);