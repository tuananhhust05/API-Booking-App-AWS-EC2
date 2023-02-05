import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import {tokenPassword} from '../utils/checkToken.js'

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

  str = str.replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|{|}|\||\\/g," ");
  return str;
}
export const register = async (req, res, next) => {
  console.log("Đăng ký",req.body)
  try {
    if( req && req.body && req.body.username && req.body.email && req.body.password){
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      
      const check = await User.find({email:String(req.body.email)});
      if(check.length == 0){
        const newUser = new User({
          ...req.body,
          password: hash,
          userNameNoVn:removeVietnameseTones(req.body.username||"")
        });
        const savedUser = await newUser.save(); // nếu trùng sẽ bị đứng code 
        if(savedUser){
           res.json({success:true})
        }
      }
      else{
        console.log("Trùng tài khoản")
        res.json({err:"Đã có tài khoản đăng ký với tên này"})
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
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect){
      return next(createError(400, "Wrong password or username!"));
    }
    let time = new Date();
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, timeExpried: time.setDate( time.getDate() +3) },
      tokenPassword()
    );
    const { password, isAdmin, ...otherDetails } = user._doc; 
    res
      .cookie("access_token", token, {  
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails, token }, isAdmin });
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export const loginmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect){
      return next(createError(400, "Wrong password or username!"));
    }
    let time = new Date();
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, timeExpried: time.setDate( time.getDate() +3) },
      tokenPassword()
    );
    const { password, isAdmin, ...otherDetails } = user._doc; 
    res
      .cookie("access_token", token, {  
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails, token }, isAdmin });
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export const changePass = async (req, res, next) => {
  try {
    if(req.body && req.body._id && req.body.passold && req.body.passnew){
       let user = await User.findOne({_id:req.body._id});
       if(user){
          const isPasswordCorrect = await bcrypt.compare(
            req.body.passold,
            user.password
          );
          if (!isPasswordCorrect){
            return next(createError(400, "Wrong password or username!"));
          };
          const salt = bcrypt.genSaltSync(10);

          const hash = bcrypt.hashSync(req.body.passnew, salt);
          User.updateOne({_id:req.body._id},{$set:{password:hash}}).catch((e)=>{
             console.log(e)
          });
          return res.json({
             data:"Update Password successfully"
          })
       }
       else{
         return next(createError(400, "Account is not exist"));
       }
    }
    else{
       return res.json({err:"Truyền thông tin không đầy đủ"})
    }
    
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export const registeradmin = async (req, res, next) => {
  try {
    if( req && req.body && req.body.username && req.body.email && req.body.password){
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      
      const check = await User.find({email:String(req.body.email)});
      if(check.length == 0){
        const newUser = new User({
          ...req.body,
          password: hash,
          userNameNoVn:removeVietnameseTones(req.body.username||""),
          isAdmin:true,
        });
        const savedUser = await newUser.save(); // nếu trùng sẽ bị đứng code 
        if(savedUser){
           res.json({success:true})
        }
      }
      else{
        const isPasswordCorrect = await bcrypt.compare(
          req.body.password,
          check[0].password
        );
        if(isPasswordCorrect){
          User.updateOne({_id:check[0]._id},{$set:{isAdmin:true}}).catch((e)=>{
            console.log(e);
          });
          res.json({
            success:true,
            data:"Upgrade successfully"
          })
        }
        else{
          res.json({err:"Account is exist"})
        }
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