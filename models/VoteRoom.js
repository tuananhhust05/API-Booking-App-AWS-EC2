import mongoose from "mongoose";
const VoteRoomSchema = new mongoose.Schema(
  {
    RoomId: {
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
  { collection: 'VoteRooms',  // cài đặt tên cho conversations kết nối đến 
    versionKey: false   // loai bo version key  
   }    
);

export default mongoose.model("VoteRooms", VoteRoomSchema);