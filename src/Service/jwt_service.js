const jwt = require('jsonwebtoken');
require('dotenv').config();
const createError = require('http-errors');
const {create, getData, delete_data_rd } = require('../Config/connection_redis');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET



const signAccessToken = async (userId)=>{
    return new Promise( (resolve, reject)=>{

        const payload = {
            userId
        }
        const secret = ACCESS_TOKEN_SECRET;

        const options = {
            expiresIn: '1m'
        }

        jwt.sign(payload, secret, options, (err, token)=>{
            if(err){
                reject(err);
            }else{
                resolve(token);
            }
        })

    } )
}

// create middleware verify token:
const verifyAccessToken = (req, res, next)=>{
    if(!req.headers.authorization){
        return next(createError.Unauthorized());
    }

    const token = req.headers.authorization.split(' ')[1];

    // start verify token:
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload)=>{
        if( err ){
            // neu nhu mà jsonWebToken bị hỏng là return về cái này!
            if(err.name === 'jsonWebTokenError'){
                return next(createError.Unauthorized());
            }
            // nếu ko bị hỏng thì return về hết hạn!
            return next(createError.Unauthorized(err.message));
            
        }
        req.payload = payload;
        next();
    })

}

const refresh_token = async (userId)=>{
    return new Promise( (resolve, reject)=>{

        const payload = {
            userId
        }
        const secret = REFRESH_TOKEN_SECRET;

        const options = {
            expiresIn: '1y'
        }

        jwt.sign(payload, secret, options, (err, token)=>{
            if(err){
                reject(err);
            }else{
                 // userId là object id do mongoose trả về! truyển kiểu dữ liệu:
                
                 create(userId.toString(), token);
                resolve(token);

            }
        })

    } )
}

const verifyRefreshToken = (refreshToken)=>{
    return new Promise( (resolve, reject)=>{
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, payload)=>{
        if( err ){
            return reject(err);
        }

        const data_redis = await getData(payload.userId);

        if(data_redis === refreshToken){
            return resolve(payload);
        }
        return reject(createError.Unauthorized());
    })
    } )
}


module.exports = {
    signAccessToken,
    verifyAccessToken,
    refresh_token,
    verifyRefreshToken
}