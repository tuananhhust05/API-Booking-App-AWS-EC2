import mongoose from "mongoose";
const CommentsRoomSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default:"",
    },
    createAt: {
      type: Date
    },
    emotion: {
      type: [String],
      default :[]
    },
    roomId: {
      type: String,
      default :""
    },
    hotelId: {
        type: String,
        default :""
    },
    userId: {
      type: String,
      default :""
    },
  },
  { collection: 'CommentsRoom',  
    versionKey: false   
   }    
);

export default mongoose.model("CommentsRoomSchema", CommentsRoomSchema);