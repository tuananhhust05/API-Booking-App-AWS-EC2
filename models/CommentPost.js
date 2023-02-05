import mongoose from "mongoose";
const CommentPostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default:"",
    },
    createAt: {
      type: Date,
      default:new Date()
    },
    emotion: {
      type: [String],
      default :[]
    },
    userIdHostPost: {
      type: String,
      default :""
    },
    userId: {
      type: String,
      default :""
    },
    userNameComment: {
      type: String,
      default :""
    },
    imgUserComment:{
      type: String,
      default :""
    },
    IdPost: {
        type: String,
        default :""
    },
  },
  { collection: 'CommentPost',  
    versionKey: false   
   }    
);

export default mongoose.model("CommentPost", CommentPostSchema);