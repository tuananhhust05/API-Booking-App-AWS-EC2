import mongoose from "mongoose";
const PostSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    UserName: {
      type: String,
      default:""
    },
    LinkImgUserCreate: {
      type: String,
      default:"",
    },
    Title: {
      type: String,
      default:""
    },
    Content: {
      type: [String],
      default:[]
    },
    ListImg: {
        type: [String],
        default:[]
    },
    ListLike: {
        type: [String],
        default:[]
    },
    ListUserNotifySpam:{
        type: [String],
        default:[]
    },
    HotelRecommend: {
        type: [String],
        default:[]
    },
    CityRecommend: {
      type: [String],
        default:[]
    },
    SiteRecommend:{
      type: [String],
        default:[]
    },
    CreateAt: {
      type: String,
      default: new Date(),
    },
    EditTime: {
      type: Date,
      default: new Date(),
    },
    EmotionAuthor:{
      type: String,
      default:"happy"
    },
    ListPeopleTag:{
      type: [Object],
      default:[]
    },
    PermissionSeen:{
      type: String,
      default:"Personal"
    },
    IsEdit:{
      type: Number,
      default:0,
    }
  },
  { 
    collection: 'Posts',  // cài đặt tên cho conversations kết nối đến 
    versionKey: false   // loai bo version key  
  }  
);

export default mongoose.model("Post", PostSchema);
