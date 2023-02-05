import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// với bài toán của mình thì hoàn toàn có thể truyền qua params 

// middleware authorized
// với mỗi 1 trang web, trình duyệt lại lưu trứ 1 cookie khác nhau 
// xác thực token 
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;// lấy token từ cookie 
  console.log("Token hotel",token)
  if (!token) { // kiêm tra xem đã có tocken chưa 
    return next(createError(401, "You are not authenticated!"));
  }
  // giải mã và xác thực token dựa vào mật khẩu trong env=> sau đó lấy ra dữ liệu đã lưu 
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    console.log(user)
    req.user = user;  // trả ra dữ liệu cho pha sau để so sánh với prams 
    next();// đến middleware tiếp theo; nếu không có thì ra middleware ngoài cùng 
  });
};

// tác dụng: xác định token có tồn tại hay k 
// xác định xem user này có phải đã authenticate rồi hay k 
// tái sử dụng dữ liệu từ việc verify token 
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => { // gọi callback 
    // check xem có đúng tài khoản hoặc lad admin hay không 
    if (req.user.id === req.params.id || req.user.isAdmin) {  // nếu dữ liệu lấy từ token chỉ ra đây là admin thì không cần xác nhận userId 
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// xác thưch admin 
export const verifyAdmin = (req, res, next) => {
  console.log("check admin")
  const token = req.cookies.access_token;// lấy token từ cookie 
  if (!token) { // kiêm tra xem đã có tocken chưa 
    return next(createError(401, "You are not authenticated!"));
  }
  // giải mã và xác thực token dựa vào mật khẩu trong env=> sau đó lấy ra dữ liệu đã lưu 
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    if(user.isAdmin){
      next();
    }
    else{
      return next(createError(403, "You are not authorized!"));
    }
  });
};