import VoteHotel from "../models/VoteHotel.js";
import VoteRoom from "../models/VoteRoom.js";
import User from "../models/User.js";

// số lượng bài đánh giá và điểm trung bình hotel 
export const CountCaculateVoteHotel = (req, res, next) => {
    try {
        if(req.params && req.params.hotelId){
            VoteHotel.find({HotelId:String(req.params.hotelId)},{Vote:1}).then((votes)=>{
                let sum = 0;
                for(let i=0; i<votes.length; i++){
                    sum =sum + votes[i].Vote;
                }
                return res.json({
                    data:{
                       countVote:votes.length,
                       mediumVote:sum/votes.length
                    },
                    err:null
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

export const TakeListInforUserVote = (req, res, next) => {
    try {
        if(req.params && req.params.hotelId){
            VoteHotel.find({HotelId:String(req.params.hotelId)},{Vote:1,UserId:1}).then((votes)=>{
                let arrayUserId =[];
                for(let i=0; i<votes.length; i++){
                    arrayUserId.push(votes[i].UserId)
                }
                let listUserFinal =[];
                User.find({_id:{$in:arrayUserId}},{username:1,img:1}).then((users)=>{
                    for(let i=0;i<users.length;i++){
                        let a= {};
                        let ele = votes.find(e=>e.UserId == users[i]._id);
                        if(ele){
                            a.Vote = ele.Vote;
                            a.userId = ele.UserId;
                            a.img = users[i].img;
                            a.name = users[i].username;
                            listUserFinal.push(a);
                        }
                    }
                    return res.json({
                         data:listUserFinal,
                         err:null
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

export const MakeVoteHotel = async (req, res, next) => {
    try {
        if(req.body && req.body.userId && req.body.hotelId && req.body.Vote){
            console.log(req.body)
            let vote = Number(req.body.Vote);
            if(isNaN(req.body.Vote)){
                vote = 5;
            }
            else if( (Number(req.body.Vote)>5) || (Number(req.body.Vote)<=0) ){
                vote = 5;
            }
            let findVote = await VoteHotel.find({HotelId:req.body.hotelId,UserId:req.body.userId});
            console.log(findVote);
            if(findVote && findVote.length>0){
                if(findVote.length == 1){
                    const updatedVote = await VoteHotel.findByIdAndUpdate(
                        findVote[0]._id,
                        { $set: {Vote:vote} },
                        { new: true }
                    ); 
                    if(updatedVote && updatedVote._id){
                        res.json({
                            data:"Bình chọn thành công",
                            err:null,
                        })
                    }
                    else{
                        res.json({
                            data:null,
                            err:"Đã có 1 đánh giá của user này với khách sạn này, cập nhật đánh giá không thành công"
                        })
                    }
                }
                else{
                    VoteHotel.deleteMany(
                        {HotelId:req.body.hotelId,UserId:req.body.userId}
                    ).catch((e)=>{
                        console.log(e);
                    });
                    let voteObject = {
                        HotelId:req.body.hotelId,
                        UserId:req.body.userId,
                        Vote:vote,
                      };
                    let saveVote = new VoteHotel(voteObject);
                    let response = await saveVote.save();
                    if(response && response._id){
                        res.json({
                            data:"Bình chọn thành công",
                            err:null,
                        })
                    }
                    else{
                        res.json({
                            data:null,
                            err:"Đã có nhiều đánh giá của user này với khách sạn này, cập nhật đánh giá không thành công"
                        })
                    }
                }
            }
            else{
                let voteObject = {
                    HotelId:req.body.hotelId,
                    UserId:req.body.userId,
                    Vote:vote,
                  };
                let saveVote = new VoteHotel(voteObject);
                let response = await saveVote.save();
                if(response && response._id){
                    res.json({
                        data:"Bình chọn thành công",
                        err:null,
                    })
                }
                else{
                    res.json({
                        data:null,
                        err:"Chưa có đánh giá của user này với khách sạn này, cập nhật đánh giá không thành công"
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
      console.log(err);
      res.json({
        data:null,
        err:"Đã có lỗi xảy ra"
      })
    }
  };
// vote room 
export const CountCaculateVoteRoom = (req, res, next) => {
    try {
        if(req.params && req.params.roomId){
            VoteRoom.find({RoomId:String(req.params.roomId)},{Vote:1}).then((votes)=>{
                let sum = 0;
                for(let i=0; i<votes.length; i++){
                    sum =sum + votes[i].Vote;
                }
                return res.json({
                    data:{
                       countVote:votes.length,
                       mediumVote:sum/votes.length
                    },
                    err:null
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

export const TakeListInforUserVoteRoom = (req, res, next) => {
    try {
        if(req.params && req.params.roomId){
            VoteRoom.find({RoomId:String(req.params.roomId)},{Vote:1,UserId:1}).then((votes)=>{
                let arrayUserId =[];
                for(let i=0; i<votes.length; i++){
                    arrayUserId.push(votes[i].UserId)
                }
                let listUserFinal =[];
                User.find({_id:{$in:arrayUserId}},{username:1,img:1}).then((users)=>{
                    for(let i=0;i<users.length;i++){
                        let a= {};
                        let ele = votes.find(e=>e.UserId == users[i]._id);
                        if(ele){
                            a.Vote = ele.Vote;
                            a.userId = ele.UserId;
                            a.img = users[i].img;
                            a.name = users[i].username;
                            listUserFinal.push(a);
                        }
                    }
                    return res.json({
                         data:listUserFinal,
                         err:null
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