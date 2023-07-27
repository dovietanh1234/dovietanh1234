const redis = require('redis');
const client = redis.createClient({
port: 6379,
host: '127.0.0.1'
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis'));
client.connect();

const create = async (nameKey, data) => {
    try{
       // client.set(nameKey, data, redis.print);
       // set có thời gian đơn vị 'second': year*hour*minute*second
       client.set(nameKey, data, {EX: 60*60*24});
         //   await client.quit();
    }catch(error){
        console.log(error);
    }
  }

  // lấy theo hàm
  const getData = async(nameKey) =>{
    try{

        const result = await client.get(nameKey);
        return result;
    }catch(error){
        console.log(error);
    }
  }

  const delete_data_rd = async(nameKey)=>{
    try{
      client.del(nameKey);
    }catch(error){
      console.log(error);
    }
  }

// không cần lấy theo hàm lấy trực tiếp cho nhanh:
//const result = await client.get(nameKey);
//console.log(result);

// client.quit();

module.exports = {
    create: create,
    getData: getData,
    client: client,
    delete_data_rd: delete_data_rd
}