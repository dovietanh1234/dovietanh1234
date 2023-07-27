const mongoose = require('mongoose');


const conn = mongoose.createConnection('mongodb://localhost:27017/admin');

conn.on('connected', function(){
    console.log(`mongoose db connected ${this.name}`);
})

conn.on('disconnected', function(){
    console.log(`mongoose db disconnected ${this.name}`);
})

conn.on('error', function(error){
    console.log(`mongoose db error ${JSON.stringify(error)}`);
})

// khi ctrl c thoat project thi db se tu dong disconnected:
process.on('SIGINT', async()=>{
    await conn.close();
    process.exit(0);
})

module.exports = conn