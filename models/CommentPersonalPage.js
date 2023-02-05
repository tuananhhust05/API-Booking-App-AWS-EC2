import mongoose from "mongoose";
const CommentPersonalPageSchema = new mongoose.Schema(
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
    userIdHostPage: {
      type: String,
      default :""
    },
    userId: {
      type: String,
      default :""
    },
  },
  { collection: 'CommentPersonalPage',  
    versionKey: false   
   }    
);

export default mongoose.model("CommentPersonalPage", CommentPersonalPageSchema);