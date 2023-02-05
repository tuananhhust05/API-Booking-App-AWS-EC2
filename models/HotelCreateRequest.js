import mongoose from "mongoose";
const HotelCreateRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner:{
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    default:""
  },
  photos: {
    type: [String],
    default:["https://anduc.edu.vn/canh-dep-thien-nhien-the-gioi/imager_6209.jpg"]
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  cityNoVn: {
    type: String,
    required: true,
  },
  lat: {
    type: String,
    default:"106",
  },
  long: {
    type: String,
    default:"16",
  },
});

export default mongoose.model("HotelCreateRequest", HotelCreateRequestSchema)