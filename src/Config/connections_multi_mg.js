const mongoose = require('mongoose');
require('dotenv').config();

function newConnection(uri){
    const conn = mongoose.createConnection(uri);

    conn.on('connected', function(){
        console.log(`mongoose db connected ${this.name}`);
    })
    
    conn.on('disconnected', function(){
        console.log(`mongoose db disconnected ${this.name}`);
    })
    
    conn.on('error', function(error){
        console.log(`mongoose db error ${JSON.stringify(error)}`);
    })

    return conn;
}

// make connection to DB test:
const adminConnection = newConnection(process.env.URI_MONGOOSE_ADMIN);
const configConnection = newConnection(process.env.URI_MONGOOSE_CONFIG);

module.exports = {
    adminConnection,
    configConnection
}