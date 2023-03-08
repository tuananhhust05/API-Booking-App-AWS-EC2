
import Post from "../models/Post.js";
import Hotel from "../models/Hotel.js";
import axios from 'axios'
import fs from 'fs'
let domain ="https://api-booking-app-aws-ec2.onrender.com";

// trả về cả thông tin người dùng luôn; client đỡ phải call nhiều lần api để lấy thông tin user 
export const CreatePost = async (req, res, next) => {
  try {
    if(req.body && req.body.UserId && req.body.UserName && req.body.Title) {
       let savePost = new Post(req.body);
       let savedPost = await savePost.save();
       if(savedPost && savedPost._id){
           res.json({
                data:savedPost,
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
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const GetListPost = async (req, res, next) => {
    try {
      if(req.params && req.params.userId) {
         let listPost = await Post.find({})
         if( listPost  &&  listPost.length){
             if(listPost.length){
                res.json({
                    data: listPost,
                    err:null
               })
             }
             else{
                res.json({
                    data:[],
                    err:nul
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
      res.json({
        data:null,
        err:"Đã có lỗi xảy ra"
      })
    }
  };

export const GetListPostByUserId = async (req, res, next) => {
    try {
      if(req.params && req.params.userId) {
         let listPost = await Post.find({UserId:req.params.userId})
         if( listPost  &&  listPost.length){
             if(listPost.length){
                res.json({
                    data: listPost,
                    err:null
               })
             }
             else{
                res.json({
                    data:[],
                    err:nul
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
      res.json({
        data:null,
        err:"Đã có lỗi xảy ra"
      })
    }
  };

export const LikeDislikePostEle = async (req, res, next) => {
    try {
      if(req.body && req.body.PostId && req.body.userId 
      ){  
          if(req.body.status){
            // chống lặp
            const updatedPost = await Post.findByIdAndUpdate(
              String(req.body.PostId),
              {$pull:{ListLike: String(req.body.userId)}}
            );
            if(updatedPost){
              Post.findByIdAndUpdate(
                String(req.body.PostId),
                {$push:{ListLike: String(req.body.userId)}}
              ).catch((e)=>{console.log(e)})
              res.status(200).json({
                data:{
                  result:true,
                  message:"Like thành công"
                },
                error:null
              })
            }
          }
          else{
            Post.findByIdAndUpdate(
              String(req.body.PostId),
              {$pull:{ListLike: String(req.body.userId)}}
            ).catch((e)=>{console.log(e)});
            res.status(200).json({
              data:{
                result:true,
                message:"DisLike thành công",
              },
              error:null
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


export const EditPermissionPost = async (req, res, next) => {
  try {
    if(req.body && req.body.PostId && req.body.permission 
    ){  
        Post.updateOne({_id:req.body.PostId},{$set:{PermissionSeen:req.body.permission}}).catch((e)=>{console.log(e)})
        res.json("Sửa thành công")
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

export const TagUser = async (req, res, next) => {
  try {
    if(req.body && req.body.PostId && req.body.userId && req.body.username && req.body.img
    ){  
        console.log(req.body)
        Post.updateOne({_id:req.body.PostId},
              {$push:
                {
                  ListPeopleTag:{
                    userId:req.body.userId,
                    username:req.body.username,
                    img:req.body.img
                  }
                }
              }
        )
        .catch((e)=>{console.log(e)});
        res.json("Sửa thành công")
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

export const UnTagUser = async (req, res, next) => {
  try {
    if(req.body && req.body.PostId && req.body.userId 
    ){  
        Post.updateOne({_id:req.body.PostId},
              {
                $pull:{ ListPeopleTag: { userId: req.body.userId }}
              }
        )
        .catch((e)=>{console.log(e)});
        res.json("Sửa thành công")
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

export const TakeUserTag = async (req, res, next) => {
  try {
    if(req.body && req.body.PostId 
    ){  
        let data = await Post.findOne({_id:req.body.PostId},{ListPeopleTag:1});
        if(data){
          res.json({
            data:data.ListPeopleTag,
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

export const ChangeEmotion = async (req, res, next) => {
  try {
    if(req.body && req.body.PostId && req.body.emotion
    ){  
        Post.updateOne({_id:req.body.PostId},
          {$set:
            {
              EmotionAuthor:req.body.emotion
            }
          }
        )
        .catch((e)=>{console.log(e)});
        res.json("Cập nhật thành công");
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

export const EditPost = async (req, res, next) => {
  try {
    if(req.body && req.body.PostId && req.body.Title && req.body.ListImg && req.body.HotelRecommend
       && req.body.CityRecommend  && req.body.SiteRecommend
    ){  
        console.log(req.body)
        Post.updateOne({_id:req.body.PostId},
              {$set:
                {
                  Title:req.body.Title,
                  Content:req.body.Content,
                  ListImg:req.body.ListImg,
                  HotelRecommend:req.body.HotelRecommend,
                  CityRecommend:req.body.CityRecommend,
                  SiteRecommend:req.body.SiteRecommend
                }
              }
        )
        .catch((e)=>{console.log(e)});
        res.json("Sửa thành công")
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

export const DeleteFilePost = async (req, res, next) => {
  try {
    if(req.body && req.body.PostId && req.body.ImgLink
    ){  
        console.log(req.body)
        Post.updateOne({_id:req.body.PostId},
              {$pull:
                {
                  ListImg:req.body.ImgLink
                }
              }
        )
        .catch((e)=>{console.log(e)});
        if(fs.existsSync(`./public/uploads/${req.body.ImgLink.split("/")[req.body.ImgLink.split("/").length-1]}`)){
          fs.unlinkSync(`./public/uploads/${req.body.ImgLink.split("/")[req.body.ImgLink.split("/").length-1]}`);
        }
        res.json("Sửa thành công")
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

// take base cityName from history order 
// user transfrom count of downloaded post 
// we use it for skip 
export const GetListPostByHistory = async (req, res, next) => {
  try {
    if(req.body && req.body.history
    ){  
        const limitCount = 5;
        let skip = Number(req.body.skip);
        let arrayHotelId = [];
        for(let i = 0; i < req.body.history.length; i++){
            arrayHotelId.push(req.body.history[i].HotelId)
        }
        let listHotel = await Hotel.find({_id:{$in:arrayHotelId}});
        let listCity = [];
        for(let i = 0; i < listHotel.length; i++){
          listCity.push(listHotel[i].city)
        }
        let listPost = await Post.aggregate([
          {$match:{CityRecommend:{$in:listCity}}},
          {$sort:{_id:-1}},
          {$skip:skip}, // bỏ qua bài viết đầu tiên 
          {$limit:limitCount}, // lấy 2 bài viết sau đó tính cả nó 
          {$sort:{_id:-1}},
        ]);
        return res.json({
          data:listPost,
          err:null
        });
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


export const GetListPostByHotelName = async (req, res, next) => {
  try {
    if(req.body && req.body.HotelNames
    ){  
        const limitCount = 5;
        let skip = Number(req.body.skip);
        let listHotel = req.body.HotelNames;
        let listPost = await Post.aggregate([
          {$match:{HotelRecommend:{$in:listHotel}}},
          {$sort:{_id:-1}},
          {$skip:skip}, // bỏ qua bài viết đầu tiên 
          {$limit:limitCount}, // lấy 2 bài viết sau đó tính cả nó 
          {$sort:{_id:-1}},
        ])
        res.json({
          data:listPost,
          err:null
        })
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

export const GetListPostRanDomListPostBaned = async (req, res, next) => {
  try {
    if(req.body && req.body.ListPostBaned
    ){  
        const listPostId = req.body.ListPostBaned;
        // console.log("Danh sách bài post bị cấm",listPostId)
        const limitCount = 5;
        let skip = Number(req.body.skip);
        let listPost = await Post.aggregate([
          {$match:{_id:{$nin:listPostId}}},
          {$sort:{_id:-1}},
          // {$project:{
          //   Title:1,
          //   CreateAt:1
          // }},
          {$skip:skip},  
          {$limit:limitCount}, 
          {$sort:{_id:-1}},
        ])
        res.json({
          data:listPost,
          err:null
        })
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

export const DeletePost = async (req, res, next) => {
  try {
    if(req.body && req.body.userId && req.body.postId
    ){  
       Post.deleteOne({UserId:req.body.userId,_id:req.body.postId}).catch((e)=>{
          console.log(e);
       })
       res.json("Xóa thành công")
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