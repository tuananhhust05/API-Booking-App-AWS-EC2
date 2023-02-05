import mongoose from "mongoose";
const CommentsSchema = new mongoose.Schema(
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
    hotelId: {
      type: String,
      default :""
    },
    userId: {
      type: String,
      default :""
    },
  },
  { collection: 'Comments',  // cài đặt tên cho conversations kết nối đến 
    versionKey: false   // loai bo version key  
   }    
);

export default mongoose.model("Comments", CommentsSchema);