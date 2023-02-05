import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userNameNoVn:{
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,  
    },
    country: {
      type: String,
      default:"Việt Nam",
    },
    img: {
      type: String,
      default:"Việt Nam",
    },
    city: {
      type: String,
      default:"",
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false, // mặc định là false nếu không cài 
    },
    manager:{
      type: Boolean,
      default: false, 
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);