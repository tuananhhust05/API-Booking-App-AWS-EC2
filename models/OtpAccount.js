import mongoose from "mongoose";
const OtpAccountsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default:"",
    },
    otp: {
      type: Number,
      require:true
    }
  },
  { collection: 'OtpAccounts',  
    versionKey: false  
   }    
);

export default mongoose.model("OtpAccounts", OtpAccountsSchema);