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
  { collection: 'Comments',  
    versionKey: false  
   }    
);

export default mongoose.model("Comments", CommentsSchema);