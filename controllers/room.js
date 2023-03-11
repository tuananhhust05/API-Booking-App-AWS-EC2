import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Order from "../models/Order.js";
import fs from "fs"
import { createError } from "../utils/error.js";
import RoomCreateRequest from "../models/RoomCreateRequest.js";
let domain ="https://api-booking-app-aws-ec2.onrender.com";
let domainCheck="//api-booking-app-aws-ec2.onrender.com"
// tạo phòng cho 1 khách sạn 
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {  // thêm 1 phòng vào mảng phòng trong khách sạn 
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};
// cập nhật dữ liệu của 1 phòng 
// new: true áp dụng cho phương thức PUT 
export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
// cập nhật những ngày có thể thuê=> thêm phần tử vào mảng trong mongo 
export const updateRoomAvailability = async (req, res, next) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    await Room.updateOne(
      // truy cập thẳng vào id phòng trong bảng room
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    await Room.updateOne(
      // truy cập thẳng vào id phòng trong bảng room
      { "roomNumbers._id": req.params.id },
      {
        $pull: {
          "roomNumbers.$.unavailableDates": {$lte: new Date()} // xóa những ngày đã hết hạn 
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
// xóa phòng thì xóa những phòng trong bảng room và xóa trong danh sách phòng 
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const getRoomsByUserId = async (req, res, next) => {
  try {
    if(req.params && req.params.id){
      const listRoom = await Room.find({Owner: String(req.params.id)});
      if(listRoom){
        res.json(listRoom)
      }
     }
     else{
      res.json({
        err:"Thông tin truyền lên không đầy đủ"
      })
     }
  } catch (err) {
    next(err);
  }
};

export const getRoomsByHotelId = async (req, res, next) => {
  try {
    if(req.params && req.params.id){
      const listRoom = await Room.find({hotelOwner: String(req.params.id)} , {desc:1});
      if(listRoom){
        res.json({
          result:listRoom,
          err: false
        })
      }
     }
     else{
      res.json({
        result:false,
        err:"Thông tin truyền lên không đầy đủ"
      })
     }
  } catch (err) {
    //next(err);
    res.json({
      result:false,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const uploadFilesImgRoom = async (req, res) => {
  try{ 
      if(req.body && req.body.RoomId && req.files){
        let urls = [];
        for(let i=0; i<res.req.files.length; i++){
          urls.push(`${domain}/images/rooms/${res.req.files[i].filename}`);
        };
        const updatedHotel = await Room.findByIdAndUpdate(
          String(req.body.RoomId),
          { $push: { photos: { $each:urls } } },
          { new: true }
        );
        // thà không trả còn hơn là chết server 
        if(updatedHotel){
          res.json({
            data: updatedHotel,
            err: null
          })
        }
      }
      else{
        res.json({
          data: null,
          err: "Thông tin truyền lên không đầy đủ"
        })
      }
  }
  catch(e){
    console.log(e);
    res.json({
      data: null,
      err: "Đã có lỗi xảy ra"
    })
  }
}

export const DeleteImgRoom = async (req, res, next) => {
  try {
    if(req.body && req.body.RoomId && req.body.ImgLink){
      if(String(req.body.ImgLink).split(":")[1]== domainCheck){
        const updatedHotel = await Room.findByIdAndUpdate(
          String(req.body.RoomId),
          { $pull: { photos: String(req.body.ImgLink) } },
          { new: true }
        );
        fs.unlinkSync(`./public/images/rooms/${String(req.body.ImgLink).split("/")[String(req.body.ImgLink).split("/").length-1]}`);
        if(updatedHotel){
          res.json({
            data: updatedHotel,
            err: null
          })
        }
      }
      else{
        const updatedHotel = await Room.findByIdAndUpdate(
          String(req.body.RoomId),
          { $pull: { photos: String(req.body.ImgLink) } },
          { new: true }
        );
        if(updatedHotel){
          res.json({
            data: updatedHotel,
            err: null
          })
        }
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
    res.json({
      data: null,
      err: "Đã có lỗi xảy ra"
    })
  }
};

const get_day_of_month = (monthIn,yearIn) => {
  try{
    return new Date(yearIn, monthIn, 0).getDate();
  }
  catch(e){
    return 0
  }
};

const compareTwoDate = (date1, date2) =>{
  try{
     if(Number(date1.year) == Number(date2.year)){
         if(Number(date1.month) == Number(date2.month)){
             if(Number(date1.day) == Number(date2.day)){
                  return false;
             }
             else if(Number(date1.day) > Number(date2.day)){
                  return true;
             }
             else{
                  return false;
             }
         }
         else if(Number(date1.month) > Number(date2.month)){
             return true;
         }
         else{
             return false;
         }
     }
     else if( Number(date1.year) > Number(date2.year) ){
         return true;
     }
     else{
         return false;
     }
  }
  catch(e){
     return false;
     console.log(e)
  }
}

const takeArrayDateBetweenDate = (date1,date2)=>{
   try{
     const today = {day:new Date().getDate(),month:new Date().getMonth()+1,year:new Date().getFullYear()};
     let array = []
     if(compareTwoDate(date1,date2)){
         if(date1.month == date2.month ){
            for(let i=date2.day; i<=date1.day; i++){
               array.push({month:date1.month,year:date1.year,day:i})
            }
         }
         else{
            if(date1.year == date2.year){
                   for(let i = date2.day; i<= get_day_of_month(date2.month,date2.year); i++){
                        array.push({month:date2.month,year:date2.year,day:i})
                   }
                   for(let i = 1; i<= date1.day; i++){
                        array.push({month:date1.month,year:date1.year,day:i})
                   }
            }
            else{
                   for(let i = date2.day; i<= 31; i++){
                        array.push({month:12,year:date2.year,day:i})
                   }
                   for(let i = 1; i<= date1.day; i++){
                         array.push({month:1,year:date1.year,day:i})
                   }
            }
         }
     }
     else{
         if(date1.month == date2.month ){
             for(let i=date1.day; i<=date2.day; i++){
               array.push({month:date1.month,year:date1.year,day:i})
             }
         }
         else{
             if(date1.year == date2.year){
                   for(let i = date1.day; i<= get_day_of_month(date1.month,date1.year); i++){
                         array.push({month:date1.month,year:date1.year,day:i})
                   }
                   for(let i = 1; i<= date2.day; i++){
                         array.push({month:date2.month,year:date2.year,day:i})
                   }
             }
             else{
                   for(let i = date1.day; i<= 31; i++){
                         array.push({month:12,year:date1.year,day:i})
                   }
                   for(let i = 1; i<= date2.day; i++){
                         array.push({month:1,year:date2.year,day:i})
                   }
             }
         }
     }
     array = array.filter((e)=>compareTwoDate(e,today));
     return array;
   }
   catch(e){
       return []
       console.log(e)
   }
}
export const GetArrayDayUnAvailabilityRoomNumber = async (req, res, next) => {
  try {
    if(req.params && req.params.IdRoomNum){
        let listDayUnAvailability =[];
        let listOrder = await Order.find({IdRoomNumber:req.params.IdRoomNum,LastDayServe:{$gte:new Date()}},{LastDayServe:1,FirstDayServe:1});
        if(listOrder && listOrder.length >0){
            for(let i=0;i<listOrder.length;i++){
               let startDay = {day:listOrder[i].FirstDayServe.getDate(),month:listOrder[i].FirstDayServe.getMonth()+1,year:listOrder[i].FirstDayServe.getFullYear()};
               let endDay = {day:listOrder[i].LastDayServe.getDate(),month:listOrder[i].LastDayServe.getMonth()+1,year:listOrder[i].LastDayServe.getFullYear()}
               let arrayDay = takeArrayDateBetweenDate(startDay,endDay);
               if(arrayDay && arrayDay.length && arrayDay.length >0){
                  for(let j=0; j<arrayDay.length; j++){
                    listDayUnAvailability.push(arrayDay[j])
                  }
               }
            }
            res.json({
              data: listDayUnAvailability,
              err: null
            })
        }
        else{
            res.json({
              data: null,
              err: "Không tìm thấy đơn hàng với phòng này"
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
    console.log(err)
    res.json({
      data: null,
      err: "Đã có lỗi xảy ra"
    })
  }
};

// just focus take money base on order 
export const CreateRoomRequest = async (req, res, next) => {
  try {
    console.log(req.body)
    if(req.body){
        let newRequest = new Room(req.body);
        newRequest.save().catch((e)=>{
           console.log(e)
        })
        return res.json({
          data:"Saved successfully",
          err:null
        })
    }
    else{
      return res.json({
        data: null,
        err: "Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      data: null,
      err: "Đã có lỗi xảy ra"
    })
  }
};

export const GetListRoomRequest = async (req, res, next) => {
  try {
    if(req.body){
      let skip = Number(req.body.skip);
      let listRoomRequest = await RoomCreateRequest.aggregate([
        { $skip : skip },
        { $limit: 10 }
      ]);
      res.status(200).json({
        data: listRoomRequest,
        error: null
      });
    }
  } catch (err) {
    console.log(err)
    res.json({
      data: null,
      err: "Đã có lỗi xảy ra"
    })
  }
};

export const AcceptRoomRequest = async (req, res,next) => {
  try {
    if(req.body && req.body.Id){
        let requestRoom = await RoomCreateRequest.findOne({_id:req.body.Id});
        let roomNumberList = [];
        for(let i=0; i<requestRoom.roomNumbers.length; i++){
            roomNumberList.push({
              number:String(requestRoom.roomNumbers[i]),
              unavailableDates: [ new Date() ]
            })
        }
        let dataInsert = {
          desc: requestRoom.desc,
          maxPeople: requestRoom.maxPeople,
          price: requestRoom.price,
          title: requestRoom.title,
          roomNumbers: roomNumberList,
          updatedAt: new Date(),
          hotelOwner: requestRoom.hotelOwner,
          Owner: requestRoom.Owner,
          hotelNameOwn:requestRoom.hotelNameOwn || "",
          photos:requestRoom.photos,
        }
        let newRoom = new Room(dataInsert);
        newRoom.save().catch((e)=>{
           console.log(e);
        });
        res.json({
          data:"Accepted successfully",
          error:null
        })
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

export const DeclineRoomRequest = async (req, res,next) => {
  try {
    if(req.body && req.body.Id){
        RoomCreateRequest.deleteOne({_id:req.body.Id}).catch((e)=>{
           console.log(e);
        })
        res.json({
          data:"Deleted request successfully",
          error:null
        })
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

// must have token and verify it. 
export const AddRoomNumber = async (req, res,next) => {
  try {
    if(req.body && req.body.IdCategory && req.body.roomNumber && req.body.countBed
       && (!isNaN(req.body.countBed) && (Number(req.body.countBed) > 0))
      ){
      let category = await Room.findOne({_id:String(req.body.IdCategory)},{"roomNumbers.number":1});
      if(category){
          if(category.roomNumbers.find((e)=> String(e.number) === String(req.body.roomNumber))){
              return res.status(200).json({
                error:"Invalid roomNumber"
              });
          }
          else{
              await Room.updateOne({_id:req.body.IdCategory},{$push:{
                roomNumbers:{
                  number:req.body.roomNumber,
                  countBed:Number(req.body.countBed)
                }
              }});
              return res.status(200).json({
                data: "Added RoomNumber successfully",
              });
          }
      }
      else{
        return res.status(200).json({
          error:"Can not find category"
        });
      }
    }
    else{
      return res.status(200).json({
        error:"Invalid Input"
      });
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

export const DeleteRoomNumber = async (req, res,next) => {
  try {
    if(req.body && req.body.IdCategory && req.body.roomNumber){
      // check and decode jwt token 
      let category = await Room.findOne({_id:String(req.body.IdCategory),"roomNumbers.number":req.body.roomNumber},{"roomNumbers.number":1});
      if(category){
          if(category.roomNumbers.find((e)=> String(e.number) === String(req.body.roomNumber))){
              // check permission user 
              // check order exist => if(true) => stop deleting room
              await Room.updateOne({_id:req.body.IdCategory},{$pull:{
                roomNumbers:{
                  number:req.body.roomNumber
                }
              }});
              return res.status(200).json({
                data: "Removed RoomNumber successfully",
              });
          }
          else{
              return res.status(200).json({
                error:"Invalid roomNumber"
              });
          }
      }
      else{
        return res.status(200).json({
          error:"Can not find category"
        });
      }
    }
    else{
      return res.status(200).json({
        error:"Invalid Input"
      });
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

