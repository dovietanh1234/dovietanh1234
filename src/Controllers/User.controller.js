const user = require('../Models/User.model');
const createError = require('http-errors');
const {userValidate} = require('../Config/validation');
//const bcrypt = require('bcrypt');
const {signAccessToken, refresh_token, verifyRefreshToken} = require('../Service/jwt_service');

const {delete_data_rd } = require('../Config/connection_redis');


module.exports = {
    register: async (req, res, next)=>{
        // console.log(req.body);
        // res.send('function register');
    
        try{
            const {email, password} = req.body;
    
            // if(!email || !password){
            //     throw createError.BadRequest();
            // }
    
            const {error} = userValidate(req.body);
            if(error){
                throw createError(error.details[0].message)
            }
    
    
            const isExist = await user.findOne({
                username: email
            })
    
            if(isExist){
                throw createError.Conflict(`${email} is already been registed`);
            }
    
    
            // mã hóa bcrypt:
            // const salt = await bcrypt.genSalt(10);
            // const hashPassword = await bcrypt.hash(password, salt);
    
            // method create ko ho tro middleware đọc dữ liệu trước khi save -> ta phải dùng save
            // const isCreate = await user.create({
            //     username: email,
            //     password: hashPassword
            // })
    
            const user1 = new user({
                username: email,
                password: password
            })
    
            const saveUser = await user1.save();
    
            return res.json({
                status: 'oke',
                element: saveUser
            })
    
        }catch(error){
            // chạy vào middleware handle code ta da lam 
            next(error);
        }
    
    },
    refreshToken: async (req, res, next)=>{
        try{
            const {refreshToken} = req.body;
            if(!refreshToken){
                console.log('lot vao dieu kien refresh sai!')
                throw createError.BadRequest();
            } 
    
            // verify token xem có đúng không
            const {userId} = await verifyRefreshToken(refreshToken);
    
            if(!userId){
                throw createError.NotFound('email is not exist');
            }
    
            const accessToken = await signAccessToken(userId);
            const sigrefreshToken = await refresh_token(userId);
    
            res.json({
                accessToken,
                refreshToken: sigrefreshToken
            })
          
        }catch(error){
            console.log('lỗi logic')
            next(error);
        }
    },
    login: async (req, res, next)=>{
        try{
            const {email, password} = req.body;
            const {error} = userValidate(req.body);
            if(error){
                throw createError(error.details[0].message)
            }
    
            const user_exist = await user.findOne({
                username: email
            })
    
            if(!user_exist){
                throw createError.NotFound('email is not exist')
            }
    
          const isValid =  await user_exist.comparePassword(password);
           
        if(!isValid){
                throw createError.Unauthorized('password is not match');
            }
    
    
            // tao token khi dang nhap:
            const AccessToken = await signAccessToken(user_exist._id);
    
            const refreshToken = await refresh_token(user_exist._id);
    
            return res.status(200).json({
                token: AccessToken,
                refresh_token: refreshToken,
                message: 'login successfully'
            })
    
        }catch(error){
            next(error);
        }
    },
    logout: async (req, res, next)=>{
        try{
    
            const {refreshToken} = req.body;
            if( !refreshToken ){
                throw createError.BadRequest();
            }
            // verify refresh token on server:
            const { userId } = await verifyRefreshToken(refreshToken);
    
            if(!userId){
                return res.status(404).json({
                    message: "token is not match or not found"
                })
            }
    
            await delete_data_rd(userId.toString());
    
            return res.status(200).json({
                message: "Logout!"
            })
    
        }catch(error){
            next(error);
        }
    },
    list: (req, res, next)=>{


        const list_user = [
            {
               email: 'dovietanh2k@gmail.com' 
            }, {
                email: 'conmeo2k@gmail.com'
            }, {
                email: 'concho2k@gmail.com'
            },
        ]
        // khi verify token success se response ve list tren!
        // verify token ( ta se dung middleware check token )
        res.status(200).json({
            list_user
        })
    }
}