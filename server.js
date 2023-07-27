const express = require('express');
const app = express();
const UserRouter = require('./src/Routers/User.router');
const createError = require('http-errors');
require('dotenv').config();
// khai bao moongose auto connection:
// require('./src/Config/connection_mg');


const {create, getData } = require('./src/Config/connection_redis');


// create('refreshToken2', 'abc05d6g1d2g5f1a');

// cách 1 lấy qua function
// (async ()=>{
//     try{
//         const data_redis = await getData('refreshToken2');
//         console.log(  'data take by func ' + data_redis);
//     }catch(error){
//     console.log(error);
// }
// })()


// sử dụng middleware json
app.use(express.json());
// đưa dữ liệu object array về format của json 
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res, next)=>{
    res.send('Home page');
}  )

app.use('/user', UserRouter);

// phải đưa middleware bắt lỗi ở dưới 
// sử dụng một cái middleware:
app.use( (req, res, next)=>{
    // cách 1:
    //  const error = new Error('not found');
    //  error.status(500);
    //  next(error);
     // cách 2
     next(createError.NotFound('sorry router is not exist'))
} );

// ta sẽ bắt cái middleware error trên | ta sẽ sử dụng middleware tiếp:
app.use( (err, req, res, next)=>{
    res.json({
        status: err.status || 500,
        message: err.message
    })
} )


const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
})