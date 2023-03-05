import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import HotelCreateRequest from "../models/HotelCreateRequest.js";
import CityData from "../models/CityData.js";
import Order from "../models/Order.js";
import fs from 'fs'
import { getLinkPreview } from "link-preview-js";
let domain ="https://api-booking-app-aws-ec2.onrender.com";
let domainCheck="//api-booking-app-aws-ec2.onrender.com"

function removeVietnameseTones(str) {
  if(String(str).trim() != ""){
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
  else{
    return "";
  }
}

// tạo khách sạn 
export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    Hotel.updateOne({_id:savedHotel._id},{$set:{hotelNoVn:removeVietnameseTones(hotels[i].name)}}).catch((e)=>{console.log(e)})
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

export const getHotelByOwner = async (req, res, next) => {
  try {
   if(req.params && req.params.id){
    const listHotel = await Hotel.find({owner: String(req.params.id)});
    if(listHotel){
      res.json(listHotel)
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
// cập nhật dữ liệu khách sạn
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
// xóa khách sạn 
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if(hotel){
      res.status(200).json(hotel);
    }
    else{
      res.status(200).json({})
    }
  } catch (err) {
    next(err);
  }
};
export const getImgLocationHotel = async (req, res, next) => {
  try {
    if(req.body && req.body.lat && req.body.link && req.body.long){
      getLinkPreview(
        `${req.body.link}`
    ).then((doc)=>{
        if(doc){
          console.log(doc)
          let linkImage = (doc.images.length>0) ? doc.images[0] :"https://vtv1.mediacdn.vn/thumb_w/650/Uploaded/nguyetmai/2014_05_22/Riu-Palace-Las-Americas-resort-Cancun-Mexico_220514.jpg";  
          return res.json({
            data:linkImage,
            err:null
          })
        }
    }).catch((e)=>{
        console.log(e);
        return res.json({
          data:"https://vtv1.mediacdn.vn/thumb_w/650/Uploaded/nguyetmai/2014_05_22/Riu-Palace-Las-Americas-resort-Cancun-Mexico_220514.jpg",
          err:null
        })
    });
    }
    else{
      res.json({
        data:null,
        err:"Thông tin truyền lên không đầy đủ"
      })
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  try {
    let cheapestPrice = 200;
    if(req.query.cheapestPrice && (!isNaN(req.query.cheapestPrice)) && (Number(req.query.cheapestPrice) > 0)){
      cheapestPrice = Number(req.query.cheapestPrice);
    }
    const hotels = await Hotel.find(
    { 
      $and:[
             {cityNoVn:new RegExp(removeVietnameseTones(req.query.city),'i')},
             {hotelNoVn:new RegExp(removeVietnameseTones(req.query.hotelName || ""),'i')},
             {cheapestPrice: {$lte: cheapestPrice}}
          ]
    }
    ).limit(100); 
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

export const AddNameHotelNovn = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({},{name:1});
    for(let i=0; i<hotels.length; i++) {
       await Hotel.updateOne({_id:hotels[i]._id},{$set:{hotelNoVn:removeVietnameseTones(hotels[i].name)}});
       console.log('update name hotel novn',hotels[i].name,i)
    }
    res.status(200).json("updated succesfully");
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    // tất cả ok mới ok 
    const list = await Promise.all(// vòng lặp đếm => performance send liên tục 
      cities.map((city) => {
        return Hotel.countDocuments({ city: city }); // countDocuments mặc định của moogose 
      })
    );
    // list trả về 1 mảng gồm các số ? 
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);// lấy dữ liệu của 1 khácg sạn 
    const list = await Promise.all( // send liên tục => tối ưu performance 
      hotel.rooms.map((room) => {   //Lấy thông tin cụ thể từng phòng dựa trên danh sách phòng trog khách sạn
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};

export const uploadFilesImgHotel = async (req, res) => {
  try{ 
      if(req.body && req.body.HotelId && req.files){
        let urls = [];
        for(let i=0; i<res.req.files.length; i++){
          urls.push(`${domain}/images/hotels/${res.req.files[i].filename}`);
        };
        const updatedHotel = await Hotel.findByIdAndUpdate(
          String(req.body.HotelId),
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

export const DeleteImgHotel = async (req, res, next) => {
  try {
    if(req.body && req.body.HotelId && req.body.ImgLink){
      if(String(req.body.ImgLink).split(":")[1]== domainCheck){
        const updatedHotel = await Hotel.findByIdAndUpdate(
          String(req.body.HotelId),
          { $pull: { photos: String(req.body.ImgLink) } },
          { new: true }
        );
        fs.unlinkSync(`./public/images/hotels/${String(req.body.ImgLink).split("/")[String(req.body.ImgLink).split("/").length-1]}`);
        if(updatedHotel){
          res.json({
            data: updatedHotel,
            err: null
          })
        }
      }
      else{
        const updatedHotel = await Hotel.findByIdAndUpdate(
          String(req.body.HotelId),
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
    res.json({
      data: null,
      err: "Đã có lỗi xảy ra"
    })
  }
};

export const UpLoadFile = async (req, res, next) => {
  try {
    if(req.files) {
      console.log(req.files)
      let urls = [];
      for(let i=0; i<res.req.files.length; i++){
        urls.push(`${domain}/uploads/${res.req.files[i].filename}`);
      };
      res.json({
        data:urls,
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
    res.json({
      data:null,
      err:"Đã có lỗi xảy ra"
    })
  }
};

export const DeleteFile = async (req, res, next) => {
  try {
    if(req.body) {
      fs.unlinkSync(`./public/uploads/${String(req.body.ImgLink).split("/")[String(req.body.ImgLink).split("/").length-1]}`);
      res.json("Xóa file thành công")
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


export const GetListCityBySortCountHotel = async (req, res, next) => {
  try {
    if(req.body) {
         let data = await Hotel.aggregate([{ "$group": { _id: "$city", count: { $sum: 1 } } },{"$sort":{count:-1}}]);
         if(data){
            let dataFinal = [];
            for(let i = 0; i < data.length; i++){
              dataFinal.push({
                  _id: data[i]._id,
                  count: data[i].count,
                  img:""
              })
            }
            res.json({
              data:dataFinal,
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

export const TakeDataCity = async (req,res,next)=>{
  try{
     if(req.body && req.body.listCity){
       let data = await CityData.find({name:{$in:req.body.listCity}});
       if(data){
        res.json({
          data,
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
  }
  catch(err){
    console.log(err);
    next(err);
  }
}

export const TakeListHotelInCity = async (req,res,next)=>{
  try{
     if(req.body && req.body.city){
       let data = await Hotel.find({city:req.body.city});
       if(data){
        res.json({
          data,
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
  }
  catch(err){
    console.log(err);
    next(err);
  }
}

// Lấy 2 khách sạn có đơn muộn nhất và 2 khách sạn bất kỳ
export const TakeHotelRecommend = async (req,res,next)=>{
  try{
     if(req.params && req.params.userId){
       let data = await Order.aggregate(
        [
          {
            $match: { "UserOrderId":req.params.userId }
          },
          {
            $group :
              {
                _id : "$HotelId",
                count: { $sum: 1 }
              }
           },
           {$limit:2}
         ]
       );
       let listHotelHistory = [];
       if(data){
           if(data.length && (data.length>0)){
               for(let i=0; i<data.length; i++){
                   listHotelHistory.push(data[i]._id);
               }
           }
       }
       let DataHotelHistory = await Hotel.find({_id:{$in:listHotelHistory}}).limit(2);
       let count = 0;
       count = 4 - DataHotelHistory.length;
       if(count <1){
          count = 2
       }
       let DataHotelRandom = await Hotel.find({_id:{$nin:listHotelHistory}}).limit(count);
       let listHotel = [];
       for(let i=0; i<DataHotelHistory.length; i++){
           listHotel.push(DataHotelHistory[i]);
       }
       for(let i=0; i<DataHotelRandom.length; i++){
           listHotel.push(DataHotelRandom[i]);
       }
       res.json({
          data:listHotel,
          err:null
        })
     }
     else{
        res.json({
          data:null,
          error:"Thông tin truyền lên không đầy đủ"
        })
     }
  }
  catch(err){
    console.log(err);
    next(err);
  }
}

//HotelCreateRequest
export const SaveRequestCreateHotel = async (req, res,next) => {
  const newHotel = new HotelCreateRequest(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    console.log(err)
    next(err);
  }
}

export const GetListHotelRequest = async (req, res,next) => {
  try {
    if(req.body){
        console.log(req.body)
        let skip = Number(req.body.skip);
        let listHotelRequest = await HotelCreateRequest.aggregate([
          { $skip : skip },
          { $limit: 10 }
        ]);
        res.status(200).json({
          data: listHotelRequest,
          error: null
        });
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

export const AcceptHotelRequest = async (req, res,next) => {
  try {
    if(req.body && req.body.Id){
        let requestHotel = await HotelCreateRequest.findOne({_id:req.body.Id});
        let dataInsert = {
          name: requestHotel.name,
          owner: requestHotel.owner,
          type: requestHotel.type,
          city: requestHotel.city,
          address: requestHotel.address,
          distance: requestHotel.distance,
          photos:requestHotel.photos,
          title: requestHotel.title,
          desc:requestHotel.desc,
          cheapestPrice:requestHotel.cheapestPrice,
          featured:requestHotel.featured,
          cityNoVn: requestHotel.cityNoVn,
          lat: requestHotel.lat,
          long:requestHotel.long,
          hotelNoVn:removeVietnameseTones(requestHotel.name)
        }
        let newHotel = new Hotel(dataInsert);
        newHotel.save().catch((e)=>{
           console.log(e)
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

export const DeclineHotelRequest = async (req, res,next) => {
  try {
    if(req.body && req.body.Id){
        HotelCreateRequest.deleteOne({_id:req.body.Id}).catch((e)=>{
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