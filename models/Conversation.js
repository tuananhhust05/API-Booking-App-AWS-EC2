import mongoose from "mongoose";
const ConversationSchema = new mongoose.Schema(
  {  // không khai báo _id ở đây 
    timeLastMessage:{
        type: Date,
        default: new Date(),
    },
    memberList:[
       {    
            memberId:{
                type:String,
                required: true,
            },
            nameuser:{
                type:String,
                required: true,
            },
            imguser:{
                type:String,
                required: true,
            },
            unReader:{
                type:Number,
                require:true
            }
       }
    ],
    messageList:[
       {    
            messageId:{
                type: String,
                required: true,
            },
            senderId:{
                type: String,
                required: true,
            },
            message:{
                type: String,
                default:""
            },
            emotion:[String],
            createAt:{
                type:Date,
                default: new Date()
            },
        }
    ],
  },
  { collection: 'Conversations' ,  // cài đặt tên cho conversations kết nối đến 
    versionKey: false   // loai bo version key 
  },  
);

export default mongoose.model("Conversation", ConversationSchema);