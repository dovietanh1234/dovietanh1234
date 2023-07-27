# redis_bcrypt_catchError
Dự án sử dụng redis để lưu refresh token cho phép người dùng lấy token để sử dụng một cách nhanh tróng và có thể triển khai Black list refresh token của người dùng ...
bằng cách tạo một field on server black list chứa danh sách của các userId và refresh token của họ đã bị đưa vào black list ... 
Dự án đồng thời hướng dẫn chúng ta cách catch error trả về mã lỗi một cách dễ dàng chuẩn xác! và hướng dẫn ta sử dụng joi framework để validate đầu vào thích hợp 
trong cách chống sql injection và html injection 
const userSchema = joi.object({ message: joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required() // chỉ cho phép chữ cái, số và khoảng trắng });

hoặc

const userSchema = joi.object({ message: joi.string().replace(/[^\w\s]/g, ‘’).required() // thay thế tất cả các ký tự không phải chữ cái, số hoặc khoảng trắng bằng rỗng });
