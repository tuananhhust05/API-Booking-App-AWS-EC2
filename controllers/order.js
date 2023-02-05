import Order from "../models/Order.js";

import { createError } from "../utils/error.js";
import {checkToken} from '../utils/checkToken.js'
export const TakeOrderByOwnerId = async (req, res, next) => {
  try {
    
    if(req.params && req.params.id && req.params.page  && req.params.category ){
     if(req.params.page =="orderpage"){
        let listOrder =[];
        listOrder = await Order.find({OwnerId: String(req.params.id),Status:String(req.params.category)});
        if(listOrder){
          // sắp xếp từ bé đến lớn 
          let results=[];
          for(let i = 0; i <listOrder.length; i++) {
              let a ={};
              a._id= listOrder[i]._id;
              a.HotelId= listOrder[i].HotelId;
              a.HotelName= listOrder[i].HotelName;
              a.CategoryRoomId= listOrder[i].CategoryRoomId;
              a.CategoryRoomDesc= listOrder[i].CategoryRoomDesc;
              a.RoomNumber= listOrder[i].RoomNumber;
              a.Price= listOrder[i].Price;
              a.IdRoomNumber= listOrder[i].IdRoomNumber;
              a.ListDate= listOrder[i].ListDate;
              a.DateOrder=listOrder[i].DateOrder;
              a.OwnerId=listOrder[i].OwnerId;
              a.UserOrderId= listOrder[i].UserOrderId;
              a.PhoneUserOrder= listOrder[i].PhoneUserOrder;
              a.NameUserOrder= listOrder[i].NameUserOrder;
              a.EmailUserOrder= listOrder[i].EmailUserOrder;
              a.ImgUserOrder= listOrder[i].ImgUserOrder
              a.PhoneContactExtra=listOrder[i].PhoneContactExtra;
              a.LastDayServe= listOrder[i].LastDayServe;
              a.FirstDayServe= listOrder[i].FirstDayServe;
              if( new Date(listOrder[i].LastDayServe) < new Date() ){
                  a.statusServe= 2;  // đã phục vụ 
                  results.push(a);
              }
              else{
                  a.statusServe= 1;   // chưa phục vụ 
                  results.push(a);
              }
          }
          results.sort((a, b)=> {
              if (Number(a.statusServe) < Number(b.statusServe)) {
                  return -1;// giữ nguyên 
              }
              else if (Number(a.statusServe) > Number(b.statusServe)) {
                  return 1;// đổi
              }
              else if(Number(a.statusServe) === Number(b.statusServe) ){
                  if (new Date(a.LastDayServe) < new Date(b.LastDayServe)) {
                      return 1;// giữ nguyên 
                  };
                  if (new Date(a.LastDayServe) > new Date(b.LastDayServe)) {
                      return -1;  // đổi 
                  }
              }
              return 0;
          });
          res.json(results)
        }
      }
      else if(req.params.page =="mainpage"){
        let listOrder =[];
        listOrder = await Order.find({OwnerId: String(req.params.id),Status:String(req.params.category)}).sort({LastDayServe:-1}).limit(4);
        if(listOrder){
          // sắp xếp từ bé đến lớn 
          let results=[];
          for(let i = 0; i <listOrder.length; i++) {
              let a ={};
              a._id= listOrder[i]._id;
              a.HotelId= listOrder[i].HotelId;
              a.HotelName= listOrder[i].HotelName;
              a.CategoryRoomId= listOrder[i].CategoryRoomId;
              a.CategoryRoomDesc= listOrder[i].CategoryRoomDesc;
              a.RoomNumber= listOrder[i].RoomNumber;
              a.Price= listOrder[i].Price;
              a.IdRoomNumber= listOrder[i].IdRoomNumber;
              a.ListDate= listOrder[i].ListDate;
              a.DateOrder=listOrder[i].DateOrder;
              a.OwnerId=listOrder[i].OwnerId;
              a.UserOrderId= listOrder[i].UserOrderId;
              a.PhoneUserOrder= listOrder[i].PhoneUserOrder;
              a.NameUserOrder= listOrder[i].NameUserOrder;
              a.EmailUserOrder= listOrder[i].EmailUserOrder;
              a.ImgUserOrder= listOrder[i].ImgUserOrder
              a.PhoneContactExtra=listOrder[i].PhoneContactExtra;
              a.LastDayServe= listOrder[i].LastDayServe;
              a.FirstDayServe= listOrder[i].FirstDayServe;
              if( new Date(listOrder[i].LastDayServe) < new Date() ){
                  a.statusServe= 2;  // đã phục vụ 
                  results.push(a);
              }
              else{
                  a.statusServe= 1;   // chưa phục vụ 
                  results.push(a);
              }
          }
          results.sort((a, b)=> {
              if (Number(a.statusServe) < Number(b.statusServe)) {
                  return -1;// giữ nguyên 
              }
              else if (Number(a.statusServe) > Number(b.statusServe)) {
                  return 1;// đổi
              }
              else if(Number(a.statusServe) === Number(b.statusServe) ){
                  if (new Date(a.LastDayServe) < new Date(b.LastDayServe)) {
                      return 1;// giữ nguyên 
                  };
                  if (new Date(a.LastDayServe) > new Date(b.LastDayServe)) {
                      return -1;  // đổi 
                  }
              }
              return 0;
          });
          res.json(results)
        }
      }
      else{
        res.json([])
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

export const CountOrderByOwnerId = async (req, res, next) => {
  console.log(req.params)
  try {
    if(req.params && req.params.id){
   
     let countOrder = await Order.countDocuments({OwnerId: String(req.params.id)});
     res.json({count:countOrder})
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

export const TakeUnAvailableDateByOrderRoomId = async (req, res, next) => {
    console.log(req.params)
    try {
      if(req.params && req.params.id){
       let listOrder =[];
       listOrder = await Order.find({IdRoomNumber: String(req.params.id)},{LastDayServe:1,FirstDayServe:1}).sort({FirstDayServe:-1});
       if(listOrder){
         res.json(listOrder);
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

// tính tổng số tiền đã thu được từ các đơn hàng trong quá khứ của 1 tài khoản cấp 2 
export const SumOrderByOwnerIdBefore = async (req, res, next) => {
  console.log(req.params)
  try {
    if(req.params && req.params.id){
      let sum = await Order.aggregate([
        { $match: 
          { 
            OwnerId: String(req.params.id),
            LastDayServe:{$lte:new Date()}
          } 
        },
        {
          $group: {
            _id: '$OwnerId',
            total: { $sum: '$Price' },
          },
        }
      ]);
      console.log(sum)
      res.json({sum:sum[0].total})
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

export const SumOrderByOwnerIdAfter = async (req, res, next) => {
  console.log(req.params)
  try {
    if(req.params && req.params.id){
      let sum = await Order.aggregate([
        { $match: 
          { 
            OwnerId: String(req.params.id),
            LastDayServe:{$gte:new Date()}
          } 
        },
        {
          $group: {
            _id: '$OwnerId',
            total: { $sum: '$Price' },
          },
        }
      ]);
      console.log(sum)
      res.json({sum:sum[0].total})
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

function toMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
}

export const TakeInComeSixMonthLatest = async (req, res, next) => {
  try {
      if(req.params && req.params.id){
        let monthstart = new Date().getMonth()+1;
        let month ="";
        if(monthstart<10){
            month =`0${monthstart}`
        }
        else{
            month =`${monthstart}`
        }
      let arrayBusiness =[];
      let arrayTime = [];
      let time = `${new Date().getFullYear()}-${month}-01T00:00:00.000+07:00`;
      time = new Date(time);
      arrayTime.push(new Date(`${new Date().getFullYear()}-${month}-01T00:00:00.000+07:00`))
      for(let i=1; i<7; i++){
        let timetempt;
        if(time.getMonth() == 0){
          timetempt = new Date(time.setMonth(11));
          timetempt = new Date (timetempt.setFullYear(timetempt.getFullYear()-1))
        }
        else{
          timetempt = new Date(time.setMonth(time.getMonth()-1));
        }
        arrayTime.push(timetempt)
      }
      for(let i=0; i<arrayTime.length-1; i++){
        let sum = await Order.aggregate([
          { $match: 
            { 
              OwnerId: String(req.params.id),
              LastDayServe:{$lte: new Date(arrayTime[i])},
              FirstDayServe:{$gte:new Date(arrayTime[i+1])}
            }
          },
          {
            $group: {
              _id: '$OwnerId',
              total: { $sum: '$Price' },
            },
          }
        ]);
        if(sum.length==0){
          arrayBusiness.push({
            name: toMonthName(new Date(arrayTime[i]).getMonth()+1),
            Total:0
          })
        }
        else{
          arrayBusiness.push({
            name: toMonthName(new Date(arrayTime[i]).getMonth()+1),
            Total:sum[0].total
          })
        }
       
      }
      res.json(arrayBusiness)
    }
    else{
     res.json({
       err:"Thông tin truyền lên không đầy đủ"
     })
    }
   } catch (err) {
     console.log(err)
     next(err);
   }
};

export const TakeOrderByUserIdOrder = async (req, res, next) => {
  try {
    if(req.params && req.params.UserId && req.params.token){
       console.log(req.params)
       let check = await checkToken(req.params.token);
       if( check.userId && (check.userId == req.params.UserId) && check.status) {
          let listOrder = await Order.find({UserOrderId:req.params.UserId}).sort({LastDayServe:-1});
          if(listOrder){
            res.json({
              data: listOrder,
              err: null
            })
          }
       }
       else{
          res.json({
            data: [],
            err: null
          })
       }
    }
    else{
      res.json({
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
 } catch (err) {
   console.log(err)
   next(err);
 }
}

export const CreateOrder = async (req, res, next) => {
  try {
    if( req.body && req.body.HotelId && req.body.HotelName && req.body.CategoryRoomId && req.body.CategoryRoomDesc &&
        req.body.RoomNumber  && req.body.IdRoomNumber  && req.body.DateOrder  && req.body.OwnerId && req.body.UserOrderId &&
        req.body.PhoneUserOrder  && req.body.NameUserOrder  && req.body.EmailUserOrder  && req.body.ImgUserOrder  &&
        req.body.PhoneContactExtra  && req.body.LastDayServe  && req.body.FirstDayServe && req.body.Price  && req.body.Status
      ){
        let newOrder = new Order(req.body)
        let saveOrder = await newOrder.save();
        if(saveOrder && saveOrder._id){
          res.json({
            data: saveOrder,
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
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
 } catch (err) {
   console.log(err)
   next(err);
 }
}

export const TakeOrderById = async (req, res, next) => {
  try {
    if(  req.params && req.params.id)
    {
        let OrderFind = await Order.findOne({_id:req.params.id});
        if(OrderFind && OrderFind._id){
          res.json({
            data: OrderFind,
            err: null
          })
        }
        else{
          res.json({
            data: null,
            err: "Đơn hàng không tồn tại"
          })
        }
    }
    else{
      res.json({
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
 } catch (err) {
   console.log(err)
   next(err);
 }
}

export const ChangeStatusOrder = async (req, res, next) => {
  try {
    if(  req.body && req.body.IdOrder && (String(req.body.IdOrder).length == 24) && req.body.Status )
    {
        const updatedOrder = await Order.findByIdAndUpdate(
          req.body.IdOrder,
          { $set: {Status:req.body.Status} },
          { new: true }
        );
        if(updatedOrder && updatedOrder._id){
          res.json({
            data: updatedOrder,
            err: null
          })
        }
        else{
          res.json({
            data: null,
            err: "Đơn hàng không tồn tại"
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
