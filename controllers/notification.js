import Notification from "../models/Notification.js";
import { createError } from "../utils/error.js";

export const CreateNotification = async (req, res, next) => {
    try {
      if(req.body && req.body.content && req.body.userId && req.body.type){
        let newNotification = new Notification(req.body);
        let NotificationSaved = await newNotification.save();
        if(NotificationSaved && NotificationSaved._id){
            res.json({
                data: NotificationSaved,
                err: null
            })
        }
        else{
            res.json({
                data: null,
                err: "Đã có lỗi xảy ra"
              })
        }
      }
      else{
        res.json({
          data: null,
          err: "Thông tin truyền lên không đầy đủ"
        })
      }
    } catch (err) {
      res.json({
        data: null,
        err: "Đã có lỗi xảy ra"
      })
    }
  };

export const TakeNotificationByUserId = async (req, res, next) => {
  try {
    if(req.params && req.params.userId){
      let listNotification = await Notification.find({userId:req.params.userId}).sort({createAt:-1})
      if(listNotification && listNotification.length >0){
          res.json({
              data: listNotification,
              err: null
          })
      }
      else{
          res.json({
              data: null,
              err: "Đã có lỗi xảy ra"
            })
      }
    }
    else{
      res.json({
        data: null,
        err: "Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    res.json({
      data: null,
      err: "Đã có lỗi xảy ra"
    })
  }
};

export const ReadNotification = async (req,res,next) =>{
  try {
    if(req.params && req.params.notifyId){
      let update = await Notification.updateOne({_id:req.params.notifyId},{$set:{Status:0}})
      if(update){
          res.json({
              data: "Đọc thông báo thành công",
              err: null
          })
      }
      else{
          res.json({
              data: null,
              err: "Đã có lỗi xảy ra"
            })
      }
    }
    else{
      res.json({
        data: null,
        err: "Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    res.json({
      data: null,
      err: "Đã có lỗi xảy ra"
    })
  }
}