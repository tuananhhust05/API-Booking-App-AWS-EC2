import Comment from "../models/Comment.js";
import CommentsRoom from "../models/CommentsRoom.js";
import CommentPersonalPage from "../models/CommentPersonalPage.js";
import CommentPost from "../models/CommentPost.js";
import User from "../models/User.js";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
export const TakeCommentByHotelId = (req, res, next) => {
  try {
    if(req.params && req.params.hotelId){
        Comment.find({hotelId:req.params.hotelId}).sort({createAt:-1}).then((comments)=>{
          let arrayUserId = [];
          for(let i=0;i<comments.length;i++){
            arrayUserId.push(comments[i].userId)
          }
          arrayUserId = arrayUserId.filter(onlyUnique);
  
          User.find({_id:{$in:arrayUserId}},{username:1,img:1}).then((users)=>{
            let finalresult =[];
            for(let i=0; i<comments.length;i++){
              let a={};
              let ele = users.find(e=>e._id == comments[i].userId);
              if(ele && ele !={} && ele._id){
                a._id = comments[i]._id;
                a.content=comments[i].content;
                a.createAt=comments[i].createAt;
                a.emotion=comments[i].emotion;
                a.hotelId=comments[i].hotelId;
                a.userId=comments[i].userId;
                a.imgUser = ele.img;
                a.username = ele.username;
                finalresult.push(a)
              }
            }
            return res.json({
              data: finalresult,
              err: null
            })
          })
        })
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const CreateCommentHotel= async (req, res, next) => {
  try {
    if(req.body && req.body.content && req.body.createAt && (new Date(req.body.createAt))
       && req.body.hotelId && req.body.userId 
    ){  
        let comment = {
          content:req.body.content,
          createAt: new Date(req.body.createAt),
          emotion:"",
          hotelId: req.body.hotelId,
          userId: req.body.userId 
        };
        let saveComment = new Comment(comment)
        let response = await saveComment.save()
        if(response){
            let ele = await User.find({_id:response.userId},{username:1,img:1});
            if(ele){
              if(ele.length>0){
                let a= {} ;
                a._id = response._id;
                a.content= response.content;
                a.createAt= response.createAt; 
                a.emotion= response.emotion;
                a.hotelId= response.hotelId;
                a.userId= response.userId;
                a.imgUser = ele[0].img;
                a.username = ele[0].username;
                res.json({
                  data:a,
                  err:null
                })
              }
              else{
                let deleteComment = await Comment.deleteOne({_id:String(response._id)});
                if(deleteComment){
                  res.json({
                    data:null,
                    err:"Bình luận không hợp lệ"
                  })
                }
              }
            }
          }

    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const EditCommentHotel= async (req, res, next) => {
  try {
    if(req.body && req.body.content && req.body.IdComment
    ){  
      const updatedComment = await Comment.findByIdAndUpdate(
        req.body.IdComment,
        { $set: {content:req.body.content} },
        { new: true }
      );
      if(updatedComment){
        let ele = await User.find({_id:updatedComment.userId},{username:1,img:1});
        if(ele){
          if(ele.length>0){
            let a= {} ;
            a._id = updatedComment._id;
            a.content= updatedComment.content;
            a.createAt= updatedComment.createAt; 
            a.emotion= updatedComment.emotion;
            a.hotelId= updatedComment.hotelId;
            a.userId= updatedComment.userId;
            a.imgUser = ele[0].img;
            a.username = ele[0].username;
            return res.json({
              data:a,
              err:null
            })
          }
          else{
            let deleteComment = await Comment.deleteOne({_id:String(updatedComment._id)});
            if(deleteComment){
              return res.json({
                data:null,
                err:"Bình luận không hợp lệ"
              })
            }
          }
        }
      }
    }
    else{
      return res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const DeleteCommentHotel= async (req, res, next) => {
  try {
    if(req.body && req.body.IdComment
    ){
      const deletedComment = await Comment.deleteOne({_id:String(req.body.IdComment)})
      if(deletedComment){
        return res.json({
          data:req.body.IdComment,
          err:null
        })
      }
    }
    else{
      return res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const LikeDislikeCommentHotel = async (req, res, next) => {
  try {
    if(req.body && req.body.commentId && req.body.userId 
    ){  
        if(req.body.status){
          // chống lặp
          const updatedLikeCommentHotel1 = await Comment.findByIdAndUpdate(
            String(req.body.commentId),
            {$pull:{emotion: String(req.body.userId)}}, 
            { new: true }
          );
          if(updatedLikeCommentHotel1){
            const updatedLikeCommentHotel = await Comment.findByIdAndUpdate(
              String(req.body.commentId),
              {$push:{emotion: String(req.body.userId)}}, 
              { new: true }
            );
            if(updatedLikeCommentHotel){
                return res.status(200).json({
                  data:{
                    result:true,
                    message:"Like thành công",
                    updatedLikeCommentHotel,
                  },
                  error:null
                })
            } 
          }
        }
        else{
          const updatedDisLikeCommentHotel = await Comment.findByIdAndUpdate(
            String(req.body.commentId),
            {$pull:{emotion: String(req.body.userId)}}, 
            { new: true }
          );
          if(updatedDisLikeCommentHotel){
            return res.status(200).json({
              data:{
                result:true,
                message:"DisLike thành công",
                updatedDisLikeCommentHotel,
              },
              error:null
            })
          }
        }
    }
    else{
      return res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

// bình luận phòng.
export const TakeCommentByRoomIdHotelId = async (req, res, next) => {
  try {
    if(req.body && req.body.roomId && req.body.hotelId){
       let ListComment =  await CommentsRoom.find({roomId:String(req.body.roomId),hotelId:String(req.body.hotelId)}).sort({createAt:-1});
       let listUserId = [];
       for(let i=0; i<ListComment.length ; i++){
          if(ListComment[i].userId){
            listUserId.push(ListComment[i].userId);
          }
       }
       let listUserDetail = await User.find({_id:{$in:listUserId}},{username:1,img:1});
       let ListCommentFinal =[];
       for(let i=0; i< ListComment.length; i++){
           let a = {};
           let userData = listUserDetail.find(e=> e._id == ListComment[i].userId);
           if(userData && userData._id){
              a._id = ListComment[i]._id;
              a.content = ListComment[i].content;
              a.emotion = ListComment[i].emotion;
              a.hotelId = ListComment[i].hotelId;
              a.userId = ListComment[i].userId;
              a.roomId = ListComment[i].roomId;
              a.createAt= ListComment[i].createAt;
              a.imgUser= userData.img;
              a.username = userData.username;
              ListCommentFinal.push(a);
           }
       }
       if(ListComment){
          return res.json({
            data:ListCommentFinal,
            err: null 
          })
       }
    }
    else{
      return res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const CommentRoom  = async (req, res, next) => {
  try {
    if(req.body && req.body.roomId && req.body.hotelId && req.body.content
       && req.body.userId
      ){
      
        let comment = {
            content:req.body.content,
            createAt: new Date(),
            emotion:"",
            hotelId: req.body.hotelId,
            userId: req.body.userId,
            roomId: req.body.roomId
        };
        let saveComment = new CommentsRoom(comment);
        let savedComment = await saveComment.save();
        if(savedComment){
          let ele = await User.find({_id:savedComment.userId},{username:1,img:1});
          if(ele){
            if(ele.length>0){
              let a= {} ;
              a._id = savedComment._id;
              a.content= savedComment.content;
              a.createAt= savedComment.createAt; 
              a.emotion= savedComment.emotion;
              a.hotelId= savedComment.hotelId;
              a.userId= savedComment.userId;
              a.roomId= savedComment.roomId;
              a.imgUser = ele[0].img;
              a.username = ele[0].username;
              return res.json({
                data:a,
                err:null
              })
            }
            else{
              let deleteComment = await CommentsRoom.deleteOne({_id:String(savedComment._id)});
              if(deleteComment){
                return res.json({
                  data:null,
                  err:"Bình luận không hợp lệ"
                })
              }
            }
          }
        }
    }
    else{
      return res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const EditCommentRoom = async (req, res, next) => {
  try {
    if(req.body && req.body.content && req.body.IdComment
    ){  
      const updatedComment = await CommentsRoom.findByIdAndUpdate(
        req.body.IdComment,
        { $set: {content:req.body.content} },
        { new: true }
      );
      if(updatedComment){
        let ele = await User.find({_id:updatedComment.userId},{username:1,img:1});
        if(ele){
          if(ele.length>0){
            let a= {} ;
            a._id = updatedComment._id;
            a.content= updatedComment.content;
            a.createAt= updatedComment.createAt; 
            a.emotion= updatedComment.emotion;
            a.hotelId= updatedComment.hotelId;
            a.userId= updatedComment.userId;
            a.roomId = updatedComment.roomId;
            a.imgUser = ele[0].img;
            a.username = ele[0].username;
            res.json({
              data:a,
              err:null
            })
          }
          else{
            let deleteComment = await CommentsRoom.deleteOne({_id:String(updatedComment._id)});
            if(deleteComment){
              res.json({
                data:null,
                err:"Bình luận không hợp lệ"
              })
            }
          }
        }
      }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const DeleteCommentRoom = async (req, res, next) => {
  try {
    if(req.body && req.body.IdComment
    ){
      const deletedComment = await CommentsRoom.deleteOne({_id:String(req.body.IdComment)})
      if(deletedComment){
        res.json({
          data:req.body.IdComment,
          err:null
        })
      }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const LikeDislikeCommentRoom = async (req, res, next) => {
  try {
    if(req.body && req.body.commentId && req.body.userId 
    ){  
        if(req.body.status){
          // chống lặp
          const updatedLikeCommentHotel1 = await CommentsRoom.findByIdAndUpdate(
            String(req.body.commentId),
            {$pull:{emotion: String(req.body.userId)}}, 
            { new: true }
          );
          if(updatedLikeCommentHotel1){
            const updatedLikeCommentHotel = await CommentsRoom.findByIdAndUpdate(
              String(req.body.commentId),
              {$push:{emotion: String(req.body.userId)}}, 
              { new: true }
            );
            if(updatedLikeCommentHotel){
                res.status(200).json({
                  data:{
                    result:true,
                    message:"Like thành công",
                    updatedLikeCommentHotel,
                  },
                  error:null
                })
            } 
          }
        }
        else{
          const updatedDisLikeCommentHotel = await CommentsRoom.findByIdAndUpdate(
            String(req.body.commentId),
            {$pull:{emotion: String(req.body.userId)}}, 
            { new: true }
          );
          if(updatedDisLikeCommentHotel){
            res.status(200).json({
              data:{
                result:true,
                message:"DisLike thành công",
                updatedDisLikeCommentHotel,
              },
              error:null
            })
          }
        }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

// bình luận trang cá nhân 

export const CreateCommentPersonalPage  = async (req, res, next) => {
  try {
    if(req.body && req.body.userIdHostPage && req.body.userId && req.body.content){
      
        let comment = {
            content:req.body.content,
            createAt: new Date(),
            emotion:[],
            userId: req.body.userId,
            userIdHostPage: req.body.userIdHostPage
        };
        let saveComment = new CommentPersonalPage(comment);
        let savedComment = await saveComment.save();
        if(savedComment){
          let ele = await User.find({_id:savedComment.userId},{username:1,img:1});
          if(ele){
            if(ele.length>0){
              let a= {} ;
              a._id = savedComment._id;
              a.content= savedComment.content;
              a.createAt= savedComment.createAt; 
              a.emotion= savedComment.emotion;
              a.userIdHostPage= savedComment.userIdHostPage;
              a.userId= savedComment.userId;
              a.imgUser = ele[0].img;
              a.username = ele[0].username;
              res.json({
                data:a,
                err:null
              })
            }
            else{
              let deleteComment = await CommentsRoom.deleteOne({_id:String(savedComment._id)});
              if(deleteComment){
                res.json({
                  data:null,
                  err:"Bình luận không hợp lệ"
                })
              }
            }
          }
        }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const TakeListCommentPersonalPage  = async (req, res, next) => {
  try {
    if(req.params && req.params.userIdHostPage){
      CommentPersonalPage.find({userIdHostPage:req.params.userIdHostPage}).sort({createAt:-1}).then((comments)=>{
          let arrayUserId = [];
          for(let i=0;i<comments.length;i++){
            arrayUserId.push(comments[i].userId)
          }
          arrayUserId = arrayUserId.filter(onlyUnique);
  
          User.find({_id:{$in:arrayUserId}},{username:1,img:1}).then((users)=>{
            let finalresult =[];
            for(let i=0; i<comments.length;i++){
              let a={};
              let ele = users.find(e=>e._id == comments[i].userId);
              if(ele && ele !={} && ele._id){
                a._id = comments[i]._id;
                a.content=comments[i].content;
                a.createAt=comments[i].createAt;
                a.emotion=comments[i].emotion;
                a.userIdHostPage=comments[i].userIdHostPage;
                a.userId=comments[i].userId;
                a.imgUser = ele.img;
                a.username = ele.username;
                finalresult.push(a)
              }
            }
            return res.json({
              data: finalresult,
              err: null
            })
          })
        }).catch(e=>{
          console.log(e);
          return res.json({
            data:null,
            err:"Đã có lỗi xảy ra"
          })
        })
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const LikeDislikeCommentPersonalPage = async (req, res, next) => {
  try {
    if(req.body && req.body.commentId && req.body.userId 
    ){  
        if(req.body.status){
          // chống lặp
          const updatedLikeCommentHotel1 = await CommentPersonalPage.findByIdAndUpdate(
            String(req.body.commentId),
            {$pull:{emotion: String(req.body.userId)}}, 
            { new: true }
          );
          if(updatedLikeCommentHotel1){
            const updatedLikeCommentHotel = await CommentPersonalPage.findByIdAndUpdate(
              String(req.body.commentId),
              {$push:{emotion: String(req.body.userId)}}, 
              { new: true }
            );
            if(updatedLikeCommentHotel){
                res.status(200).json({
                  data:{
                    result:true,
                    message:"Like thành công",
                    updatedLikeCommentHotel,
                  },
                  error:null
                })
            } 
          }
        }
        else{
          const updatedDisLikeCommentHotel = await CommentPersonalPage.findByIdAndUpdate(
            String(req.body.commentId),
            {$pull:{emotion: String(req.body.userId)}}, 
            { new: true }
          );
          if(updatedDisLikeCommentHotel){
            res.status(200).json({
              data:{
                result:true,
                message:"DisLike thành công",
                updatedDisLikeCommentHotel,
              },
              error:null
            })
          }
        }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const EditCommentPersonalPage = async (req, res, next) => {
  try {
    if(req.body && req.body.content && req.body.IdComment
    ){  
      const updatedComment = await CommentPersonalPage.findByIdAndUpdate(
        req.body.IdComment,
        { $set: {content:req.body.content} },
        { new: true }
      );
      if(updatedComment){
        let ele = await User.find({_id:updatedComment.userId},{username:1,img:1});
        if(ele){
          if(ele.length>0){
            let a= {} ;
            a._id = updatedComment._id;
            a.content= updatedComment.content;
            a.createAt= updatedComment.createAt; 
            a.emotion= updatedComment.emotion;
            a.hotelId= updatedComment.hotelId;
            a.userId= updatedComment.userId;
            a.imgUser = ele[0].img;
            a.username = ele[0].username;
            res.json({
              data:a,
              err:null
            })
          }
          else{
            let deleteComment = await CommentsRoom.deleteOne({_id:String(updatedComment._id)});
            if(deleteComment){
              res.json({
                data:null,
                err:"Bình luận không hợp lệ"
              })
            }
          }
        }
      }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const DeleteCommentPersonalPage = async (req, res, next) => {
  try {
    if(req.body && req.body.IdComment
    ){
      const deletedComment = await CommentPersonalPage.deleteOne({_id:String(req.body.IdComment)})
      if(deletedComment){
        res.json({
          data:req.body.IdComment,
          err:null
        })
      }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const TakeListUserCare = async (req, res, next) => {
  try {
    if(  req.body && req.body.Id && (String(req.body.Id).length == 24) 
         && req.body.Type  )
    {  
       if(req.body.Type == "hotels"){
            let ListUserId = await Comment.aggregate([
              { $match: 
                { 
                  hotelId: req.body.Id,
                  createAt:{$gte:new Date(new Date().setDate(new Date().getDate() -1))}
                }
              },
              {
                $group: {
                  _id: '$userId',
                },
              }
            ]);
            if(ListUserId){
              let listUserIdFinal = [];
              if(ListUserId.length && (ListUserId.length >0)){
                for(let i=0 ; i<ListUserId.length;i++){
                  listUserIdFinal.push(ListUserId[i]._id)
                }
              }
              res.json({
                data: listUserIdFinal,
                err:null
              })
            }
       }
       else if(req.body.Type == "rooms"){
        let ListUserId = await CommentsRoom.aggregate([
          { $match: 
            { 
              roomId: req.body.Id,
              createAt:{$gte:new Date(new Date().setDate(new Date().getDate() -1))}
            }
          },
          {
            $group: {
              _id: '$userId',
            },
          }
        ]);
        if(ListUserId){
          let listUserIdFinal = [];
          if(ListUserId.length && (ListUserId.length >0)){
            for(let i=0 ; i<ListUserId.length;i++){
              listUserIdFinal.push(ListUserId[i]._id)
            }
          }
          res.json({
            data: listUserIdFinal,
            err:null
          })
        }
       }
       else{
        res.json({
          data: null,
          err:"Type is not valid"
        })
       }
    }
    else{
      res.json({
        data: null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
 } catch (err) {
   console.log(err)
   next(err);
 }
}

// comment post 
export const takeListCommentPost = async (req, res, next) => {
  try {
    if(  req.params && req.params.IdPost  )
    {  
        let listComment = await CommentPost.find({IdPost: req.params.IdPost}).sort({createAt:-1});
        if(listComment){
          if(listComment.length){
            res.json({
              data:listComment,
              err:null
            })
          }
          else{
            res.json({
              data:[],
              err:null
            })
          }
        }
    }
    else{
      res.json({
        data: null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
 } catch (err) {
   console.log(err)
   next(err);
 }
}

export const CreateCommentPost = async (req, res, next) => {
  try {
    if(  req.body && req.body.IdPost && req.body.content && req.body.userId && req.body.userNameComment
         && req.body.imgUserComment
      )
    {  
        let newCommentPost = new CommentPost(req.body);
        let newCommentPostSaved = await newCommentPost.save();
        if(newCommentPostSaved._id){
            res.json({
              data: newCommentPostSaved,
              err:null
            })
        }
        else{
          res.json({
            data: null,
            err:"Đã có lỗi xảy ra"
          })
        }
    }
    else{
      res.json({
        data: null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
 } catch (err) {
   console.log(err)
   next(err);
 }
}
export const EditCommentPost = async (req, res, next) => {
  try {
    if(req.body && req.body.content && req.body.IdComment
    ){  
      const updatedComment = await CommentPost.findByIdAndUpdate(
        req.body.IdComment,
        { $set: {content:req.body.content} },
        { new: true }
      );
      if(updatedComment){
        res.json({
          data:updatedComment,
          err:null
        })
      }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};
export const LikeDislikePost = async (req, res, next) => {
  try {
    if(req.body && req.body.commentId && req.body.userId 
    ){  
        if(req.body.status){
          // chống lặp
          const updatedLikeCommentHotel1 = await CommentPost.findByIdAndUpdate(
            String(req.body.commentId),
            {$pull:{emotion: String(req.body.userId)}}, 
            { new: true }
          );
          if(updatedLikeCommentHotel1){
            const updatedLikeCommentHotel = await CommentPost.findByIdAndUpdate(
              String(req.body.commentId),
              {$push:{emotion: String(req.body.userId)}}, 
              { new: true }
            );
            if(updatedLikeCommentHotel){
                res.status(200).json({
                  data:{
                    result:true,
                    message:"Like thành công",
                    updatedLikeCommentHotel,
                  },
                  error:null
                })
            } 
          }
        }
        else{
          const updatedDisLikeCommentHotel = await CommentPost.findByIdAndUpdate(
            String(req.body.commentId),
            {$pull:{emotion: String(req.body.userId)}}, 
            { new: true }
          );
          if(updatedDisLikeCommentHotel){
            res.status(200).json({
              data:{
                result:true,
                message:"DisLike thành công",
                updatedDisLikeCommentHotel,
              },
              error:null
            })
          }
        }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};
export const DeleteCommentPost = async (req, res, next) => {
  try {
    if(req.body && req.body.IdComment
    ){
      const deletedComment = await CommentPost.deleteOne({_id:String(req.body.IdComment)})
      if(deletedComment){
        res.json({
          data:req.body.IdComment,
          err:null
        })
      }
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};