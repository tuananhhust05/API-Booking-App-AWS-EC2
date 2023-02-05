import mongoose from "mongoose";
const HistorySearchSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require:true
    },
    history: {
        type: [String],
        default :[]
      },
    createAt: {
      type: Date,
      default:new Date()
    },
    updateAt: {
        type: Date,
        default:new Date()
    },
  },
  { collection: 'HistorySearchs',   
    versionKey: false   
   }    
);

export default mongoose.model("HistorySearchs",HistorySearchSchema);