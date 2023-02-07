import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from "cookie-parser"
import path from 'path'
import { Server } from 'socket.io';
import http from 'http'
import functions from 'firebase-functions'
import { fileURLToPath } from 'url';
import cors from "cors"
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import ordersRoute from "./routes/orders.js";
import commentsRoute from "./routes/comment.js";
import votesRoute from "./routes/vote.js";
import notificationsRoute from "./routes/notification.js";
import postRoute from "./routes/post.js";
import conversationRoute from "./routes/conversations.js";
const app=express();
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://Tuananhhust05:Tuananh050901@cluster0.aqpat.mongodb.net/Cluster1?retryWrites=true&w=majority");
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
  });

//middlewares
app.use(cors()) // cho phép truy cập từ mọi client 
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/votes", votesRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
// config static file 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/", express.static(path.join(__dirname,"public")));

// middleware xử lý lỗi, next sẽ đi đến đây 
// lỗi trả về sẽ đi qua đây trc khi đến tay người dùng 
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
const server = http.createServer(app); // tạo ra server 
const io = new Server(server
  , {
    cors: {
      origin: '*'
    }
  }
);
let listUser = [];
const Login = (userId,socketId)=>{
  try{
     if(userId && socketId ){
        let index = listUser.findIndex((e)=>e.userId == userId);
        if(index == -1){
            listUser.push({userId,socketArray:[socketId]});
            return 1;
        }
        else{
          if(listUser[index].socketArray.includes(socketId)){
            return 0;
          }
          else{
            listUser[index].socketArray.push(socketId);
            return 1;
          }
        }
     }
     else{
        return 0
     }
  }
  catch(e){
    return 0;
    console.log(e)
  }
}
const Logout = (socketId)=>{
  try{
     let index = listUser.findIndex((e)=> e.socketArray.includes(socketId));
     if( index != -1){
         listUser[index].socketArray = listUser[index].socketArray.filter((e)=> e != socketId );
         if(listUser[index].socketArray && (listUser[index].socketArray.length == 0)){
            listUser= listUser.filter((e)=> e.userId != listUser[index].userId)
         }
     };
  }
  catch(e){
     console.log(e)
  }
}
io.on("connection", (socket) => {
  socket.on("login",(userId)=>{
    if(Login(userId,socket.id) == 1){
       socket.join(userId);
    };
    console.log(listUser)
  })
  socket.on("disconnect",()=>{
     Logout(socket.id)
  });
  socket.on("notification",(userId,notificationInfor,additionalInfor)=>{
    //  console.log("Dữ liệu socket truyền lên",userId,notificationInfor,additionalInfor)
    io.in(userId).emit("notification",notificationInfor,additionalInfor)
  })
  socket.on("comment",(listUserId,commentInfor,type)=>{
    // console.log("Dữ liệu comment truyền lên",listUserId,commentInfor,type);
    for(let i =0; i<listUserId.length; i++){
       io.in(listUserId[i]).emit("comment",commentInfor,type)
    }
  })
  socket.on("editcomment",(listUserId,commentInfor,type)=>{
    // console.log("Dữ liệu comment truyền lên",listUserId,commentInfor,type);
    for(let i =0; i<listUserId.length; i++){
       io.in(listUserId[i]).emit("editcomment",commentInfor,type)
    }
  })
  socket.on("deletecomment",(listUserId,commentInfor,type)=>{
    // console.log("Dữ liệu comment truyền lên",listUserId,commentInfor,type);
    for(let i =0; i<listUserId.length; i++){
       io.in(listUserId[i]).emit("deletecomment",commentInfor,type)
    }
  })
  socket.on("sendMessage",(receiver,mess)=>{
      // console.log("Dữ liệu  truyền lên",receiver,mess);
       io.in(receiver).emit("sendMessage",mess)
  });
  socket.on("DeleteMessage",(receiver,convId,messId)=>{
    // console.log("Dữ liệu  truyền lên",receiver,mess);
     io.in(receiver).emit("DeleteMessage",convId,messId)
})
})

server.listen(8800,()=>{
    connect();
    console.log("Connected to databse");
    console.log("Backend is running on http://localhost:8800")
})

