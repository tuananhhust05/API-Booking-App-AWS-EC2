import mongoose from "mongoose";
const CityDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default:"",
    },
    img: {
        type: String,
        default:"",
    },
  },
  { collection: 'CityData', 
    versionKey: false   
   }    
);

export default mongoose.model("CityData", CityDataSchema);