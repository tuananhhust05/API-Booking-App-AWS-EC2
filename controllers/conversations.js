import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const getListConvByUserId = async (req, res, next) => {
  try {
    if( req && req.body && req.body.userId){
        let ListConv = await Conversation.aggregate([
          {
            $match:{
              "memberList.memberId": req.body.userId,
              'messageList.0': {$exists: true}
            }
          },
          {$sort:{timeLastMessage:1}},
          {
            $project: {
              messageList: {
                $slice: [  
                  {
                    $filter: {
                      input: "$messageList",
                      as: "messagelist",
                      cond: { 
                          $lte: [ "$$messagelist.createAt", new Date() ] 
                      },
                    }
                  },
                  -1
                 ]
               },
               memberList:1,
               timeLastMessage:1
            }
          }
        ]);
        let listConvFinal= [];
        for(let i=0; i< ListConv.length; i++){
          let a = {};
          a._id = ListConv[i]._id;
          a.messageList = ListConv[i].messageList;
          a.timeLastMessage = ListConv[i].timeLastMessage;
          a.memberList = [];
          a.unReader = 0;
          for(let j = 0; j < ListConv[i].memberList.length; j++){
            if(ListConv[i].memberList[j].memberId != req.body.userId){
              a.memberList.push(ListConv[i].memberList[j]);
            };
            if(ListConv[i].memberList[j].memberId == req.body.userId){
              a.unReader = ListConv[i].memberList[j].unReader;
            }
          };
          listConvFinal.push(a);
        }
        listConvFinal.sort((a,b)=>{
          if (new Date(a.timeLastMessage) > new Date(b.timeLastMessage)) {
            return -1;
          }
          if (new Date(a.timeLastMessage) < new Date(b.timeLastMessage)) {
            return 1;
          }
          return 0;
        });
        listConvFinal.sort((a,b)=>{
          if (a.unReader > b.unReader) {
            return -1;
          }
          if (a.unReader < b.unReader) {
            return 1;
          }
          return 0;
        });
        if( ListConv){
            res.json({
                data: listConvFinal,
                error:null
            })
        }
    }
    else{
      res.json({err:"Truyền thông tin không đầy đủ"})
    }
  } catch (err) {
    res.json({err:"Đã có lỗi xảy ra"});
    console.log(err)
    //next(err);
  }
};

export const ReadMessage = async (req, res, next) => {
  try {
    console.log(req.body);
    if( req && req.body && req.body.userId && req.body.conversationId){
      let update = await Conversation.updateOne(
        {_id:String(req.body.conversationId),"memberList.memberId":String(req.body.userId)},
        {$set:{"memberList.$.unReader":0}});
      res.json({
        data:"Đọc tin nhắn thành công",
        error:null
      })
    }
    else{
      res.json({err:"Truyền thông tin không đầy đủ"})
    }
  } catch (err) {
    res.json({err:"Đã có lỗi xảy ra"});
    console.log(err)
    //next(err);
  }
};

export const LoadMessage = async (req, res, next) => {
  try {
    console.log(req.body);
    if( req && req.body && req.body.userId && req.body.conversationId){
      if(req.body.isDevide){
          let countMess = await Conversation.aggregate([
            {$match:{_id:ObjectId(req.body.conversationId) }},
            {$project: { count: { $size:"$messageList" }}}
          ]);
          let listMess = Number(req.body.loaded) || 0;
          if(countMess && countMess.length && (countMess.length >0) && countMess[0]._id){
              let sizeListMess = countMess[0].count -1;
              if(sizeListMess < 0){
                sizeListMess=0;
              }
              let start = sizeListMess - listMess -15;
              if(start <0){
                start = 0;
              }
              let conversation = await Conversation.find(
                {_id:String(req.body.conversationId)},
                {messageList:{$slice:[start,16]}});
              res.json({
                data:conversation[0].messageList,
                error:null
              })
            }
          else{
              res.json({
                data:null,
                error:"Lấy danh sách tin nhắn không thành công"
              })
          }
      }
      else{
        let conv = await Conversation.findOne(
          {_id:String(req.body.conversationId),"memberList.memberId":String(req.body.userId)},{messageList:1});
        if(conv){
          res.json({
            data:conv.messageList,
            error:null
          })
        }
        else{
          res.json({
            data:null,
            error:"Lấy danh sách tin nhắn không thành công"
          })
        }
      }
    }
    else{
      res.json({err:"Truyền thông tin không đầy đủ"})
    }
  } catch (err) {
    console.log(err)
    res.json({err:"Đã có lỗi xảy ra"});
    //next(err);
  }
};

// let conversation = await Conversation.find({_id:Number(req.body.conversationId)},{messageList:{$slice:[start,16]},"memberList.favoriteMessage":1,"memberList.memberId":1})
export const SendMessage = async (req,res)=>{
   try{
      if(req.body && req.body.messageId && req.body.message && req.body.senderId  && req.body.conversationId && req.body.createAt && req.body.receiverId){
          Conversation.updateOne(
            {_id:req.body.conversationId,"memberList.memberId":String(req.body.receiverId)},
            {
              $push:{
                messageList:req.body
              },
              $set:{
                "memberList.$.unReader":1,
                timeLastMessage: req.body.createAt
              }
            }).catch(function (err) {
            console.log(err);
          });
          res.json({
             data:req.body.messageId,
             error:"Gửi tin nhắn  thành công"
          })
      }
      else{
        return res.json({
          data:null,
          error:"Thông tin truyền lên không đầy đủ"
        })
      }
   }
   catch(e){
      console.log(e);
      return res.json({
        data:null,
        error:e
      })
   }
}

export const DeleteMessage = async (req,res)=>{
  try{
     if(req.params && req.params.messageId && req.params.conversationId){
         Conversation.updateOne({_id:req.params.conversationId},{
          $pull:{
            messageList:{messageId:req.params.messageId}
          }
        }).catch(function (err) {
           console.log(err);
         });
         res.json({
            data:req.params.messageId,
            error:"Xóa tin nhắn thành công"
         })
     }
     else{
       return res.json({
         data:null,
         error:"Thông tin truyền lên không đầy đủ"
       })
     }
  }
  catch(e){
     console.log(e);
     return res.json({
       data:null,
       error:e
     })
  }
}

export const CreateConv = async (req,res)=>{
  try{
     if(req.body && req.body.senderId && req.body.receiverId && (req.body.senderId != req.body.receiverId)){
      let dataUser = await User.find({_id:{$in:[req.body.senderId,req.body.receiverId]}},{username:1,img:1}).limit(2);
      if(dataUser && dataUser.length && (dataUser.length >1)){
          let ListConvExist = await Conversation.aggregate([
            {
              $match:{
                $and:[
                  {"memberList.memberId": req.body.senderId},
                  {"memberList.memberId": req.body.receiverId},
                  {'messageList.0': {$exists: true}},
                ]
              }
            },
            {
              $project: {
                messageList: {
                  $slice: [  
                    {
                      $filter: {
                        input: "$messageList",
                        as: "messagelist",
                        cond: { 
                            $lte: [ "$$messagelist.createAt", new Date() ] 
                        },
                      }
                    },
                    -1
                  ]
                },
                memberList:1,
                timeLastMessage:1
              }
            }
          ]);
          if(ListConvExist){
              if(ListConvExist.length){
                return res.json({
                  data:ListConvExist[0],
                  error:null
                })
              }
              else{
                let newConv = new Conversation({
                  timeLastMessage: new Date(),
                  memberList:[
                    {
                      memberId:req.body.senderId,
                      nameuser:dataUser.find((e)=>e._id == req.body.senderId).username,
                      imguser:dataUser.find((e)=>e._id == req.body.senderId).img
                    },
                    {
                      memberId:req.body.receiverId,
                      nameuser:dataUser.find((e)=>e._id == req.body.receiverId).username,
                      imguser:dataUser.find((e)=>e._id == req.body.receiverId).img
                    }
                  ],
                  messageList:[
                    {
                      senderId:req.body.senderId,
                      messageId:`${((new Date).getTime() * 10000) + 621355968000000000 +8}_${req.body.senderId}`,
                      message:`${dataUser.find((e)=>e._id == req.body.senderId).username} đã tạo cuộc trò chuyện`,
                      emotion:[],
                      createAt:new Date()
                    }
                  ]
                });
                let newConvSaved = await newConv.save();
                if(newConvSaved && newConvSaved._id){
                  return res.json({
                    data:newConvSaved,
                    error:null
                  })
                }
                else{
                  return res.json({
                    data:null,
                    error:"Đã có lỗi xảy ra"
                  })
                }
              }
          }
      }
     }
     else{
       return res.json({
         data:null,
         error:"Thông tin truyền lên không đầy đủ"
       })
     }
  }
  catch(e){
     console.log(e);
     return res.json({
       data:null,
       error:e
     })
  }
}