import mongoose from "mongoose";
const NotificationsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default:"",
    },
    createAt: {
      type: Date,
      default:new Date()
    },
    userId: {
      type: String,
      require:true
    },
    imgUserUrl:{
      type: String,
      require:true
    },
    senderId: {
      type: String,
      default :"",
    },
    hotelId:{
      type: String,
      default :""
    },
    roomId:{
      type: String,
      default :""
    },
    type:{
      type: String,
      require:true
    },
    Status:{
      type: Number,
      default :1
    }
  },
  { collection: 'Notifications',  
    versionKey: false   
   }    
);

export default mongoose.model("Notifications", NotificationsSchema);