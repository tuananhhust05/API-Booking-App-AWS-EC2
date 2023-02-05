import User from "../models/User.js";
import Order from "../models/Order.js"; 
import CityData from "../models/CityData.js";
import HistorySearch from "../models/HistorySearch.js"; 
let domain ="http://127.0.0.1:8800";
import fs from 'fs'
import jwt from "jsonwebtoken";
import {tokenPassword} from '../utils/checkToken.js'
export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // trả về dữ liệu sau khi sủae 
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err)
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
export const checkUser = async (req,res,next)=>{
  try {
    let token = req.body.token;
    if (!token) { // kiêm tra xem đã có tocken chưa 
      res.status(200).json({check:false});
    }
    else{
      jwt.verify(token, tokenPassword(), async (err, user) => {
        if (err) {
          res.status(200).json({check:false});
        }
        else{
          if(new Date(user.timeExpried) > new Date()){
            const user2 = await User.findById(req.params.id);
            if(user2){
              return res.status(200).json({check:true});
            }
            else{
              return res.status(200).json({check:false});
            }
          }
          else{
            return res.status(200).json({check:false});
          }
        }
       
      });
    }
  } catch (err) {
    return res.status(200).json({check:false});
    //next(err);
  }
}
export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find({});
    // console.log(users);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}
//verifyUserCheck
export const verifyUserCheck = async (req,res,next)=>{
  try {
   const token = req.cookies.access_token;// lấy token từ cookie 
   console.log("token verify thu được",token)
   if (!token) { // kiêm tra xem đã có tocken chưa 
    return next(createError(401, "You are not authenticated!"));
   }
   jwt.verify(token, process.env.JWT, async (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    const userfind = await User.findById(user.id);
    if(userfind){
      res.json(userfind._id);
    }
  });
  } catch (err) {
    next(err);
  }
}

// trả về danh sách email kèm số đơn đặt hàng của 1 admin khách sạn, sắp xếp theo thứ tự từ những khách hàng có đơn đặt hàng lớn đến bé
export const TakeListUserOrderByOwnerId = async (req, res, next) => {
  console.log(req.params)
  try {
      let listOrder =[];
      listOrder = await Order.aggregate([
          {$match:{OwnerId:req.params.id}},
          {$group : {_id:"$EmailUserOrder", count:{$sum:1}}},
          {$sort:{count:-1}},
          {$limit:100} // limit này mấy nữa cho user tự điền 
      ])
      res.json(listOrder)
  } catch (err) {
     //next(err);
     res.json({
      data:null,
      err:{
          message:"Đã có lỗi xảy ra"
      }
     })
  }
};

// đếm số khách hàng đã sử dụng dịch vụ
export const CountListUserOrderByOwnerId = async (req, res, next) => {
  console.log(req.params)
  try {
      let listOrder =[];
      listOrder = await Order.aggregate([
          {$match:{OwnerId:req.params.id}},
          {$group : {_id:"$EmailUserOrder", count:{$sum:1}}},
          {$sort:{count:-1}},
          {$limit:10000},
          {
            $count: "count"
          }
      ])
      res.json({count:listOrder[0].count})
  } catch (err) {
     //next(err);
     res.json({
      data:null,
      err:{
          message:"Đã có lỗi xảy ra"
      }
     })
  }
}; 

//TakeInforUserByMail
export const TakeInforUserByMail = async (req, res, next) => {
  console.log(req.params)
  try {
      let userinfor = await User.findOne({email:String(req.params.email)})
      if(userinfor){
        res.json({
          data:{
              result:true,
              userinfor
          },
          err:null
        })
      }
  } catch (err) {
     //next(err);
     res.json({
      data:null,
      err:{
          message:"Đã có lỗi xảy ra"
      }
     })
  }
};

// 
export const TakeUserInfoByListId = async (req, res, next) => {
  try {
    let receiveData = req.body.users;
    receiveData = receiveData.filter( e => Number(String(e).length) === 24); // đảm bảo id đúng 24 ký tự
    let users = await User.find({_id:{$in:receiveData}},{username:1,img:1});
      if(users){
         return res.json({
          data:users,
          err:null
         })
      }
      else{
        return res.json({
          data:null,
          err:{
              message:"Đã có lỗi xảy ra"
          }
         })
      }
  } catch (err) {
     console.log(err)
     res.json({
      data:null,
      err:{
          message:"Đã có lỗi xảy ra"
      }
     })
  }
};

export const TakeHistorySearch = async (req,res,next)=>{
  try {
    let history = await HistorySearch.find({userId:req.params.userId}).limit(1);
    if(history){
        if(history.length && history[0].history){
          let FinalRes = [];
          for(let i=history[0].history.length-1; i >= 0 ; i--){
            FinalRes.push(history[0].history[i]);
          }
          return res.json({
            data:{
               result:true,
               message:"Lấy thông thành công",
               history:FinalRes
            },
            error:null
          })
        }
        else{
          return res.json({
            data:{
               result:true,
               message:"Lấy thông thành công",
               history:[]
            },
            error:null
          })
        }
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

export const SaveHistorySearch = async (req,res,next)=>{
  try {
    if(req.body.message && String(req.body.message).trim().length >0){
      let history = await HistorySearch.find({userId:req.body.userId}).limit(1);
      if(history){
          if(history.length && history[0].history){
             let check = history[0].history.find((e)=> e == req.body.message );
             if(check && String(check).trim().length){
                return res.json({
                    data:{
                      message:"Lưu thành công"
                    },
                    error:null
                })
             }
             else{
                if(history[0].history.length > 5){
                  HistorySearch.updateOne(
                      { userId:req.body.userId },
                      { $pull: { history: history[0].history[0] } }
                  ).catch((e)=>{console.log(e)});
                }
                HistorySearch.updateOne(
                    { userId:req.body.userId },
                    { $push: { history: req.body.message } }
                ).catch((e)=>{console.log(e)});
                return res.json({
                    data:{
                      message:"Lưu thành công"
                    },
                    error:null
                })
             }
          }
          else{
            let newHistory = new HistorySearch({
                userId:req.body.userId,
                history:[req.body.message]
            })
            newHistory.save().catch((e)=>{console.log(e)})
            return res.json({
                data:{
                  message:"Lưu thành công"
                },
                error:null
             })
          }
      }
    }
    else{
      return res.json({
        data:{
          message:"Lưu thành công"
        },
        error:null
     })
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g," ");
  str = str.trim();

  str = str.replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  return str;
}

export const FindUser = async (req,res,next)=>{
  try {
    if(req.body.message && (String(req.body.message).trim().length >0) && req.body.userId){
       let findword = removeVietnameseTones(req.body.message);
       let users = await User.find(
            {userNameNoVn:new RegExp(findword,'i')},
            {username:1,img:1}
          ).limit(100); 
        if(users){
            let userFinal = [];
            for(let i=0; i<users.length;i++){
               userFinal.push({
                _id:users[i]._id,
                userId:users[i]._id,
                username:users[i].username,
                img:users[i].img
               })
            }
            res.json({
               data:userFinal,
               error:null
            })
        }
    }
    else{
      return res.json({
        data:null,
        error:"Thiều thông tin truyền lên"
     })
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

export const UpdateUserNameNoVn = async (req,res,next)=>{
  try {
       let users = await User.find({});  
       console.log(users)
       for(let i=0; i<users.length; i++){
          console.log(users[i])
          let update = await User.updateOne({_id:users[i]._id},{$set:{userNameNoVn:removeVietnameseTones(users[i].username)}})
       }
       res.json("Cập nhật thành công")
  } catch (err) {
    console.log(err)
    next(err);
  }
}

export const UploadAvartar = async (req,res,next)=>{
  try {
    if(req.body && req.body.userId && req.files){
      let user = await User.findOne({_id:req.body.userId});
      if(user){
        await User.updateOne({_id:req.body.userId},{$set:{img:`${domain}/avatarUser/${res.req.files[0].filename}`}});
      }
      res.json({
        data: `${domain}/avatarUser/${res.req.files[0].filename}`,
        err: null
      });
      if(fs.existsSync(`./public/avatarUser/${user.img.split("/")[user.img.split("/").length-1]}`)){
        fs.unlinkSync(`./public/avatarUser/${user.img.split("/")[user.img.split("/").length-1]}`);
      } 
    }
    else{
      res.json({
        data: null,
        err: "Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}