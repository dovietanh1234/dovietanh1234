const moongose = require('mongoose');
const Schema = moongose.Schema;
const bcrypt = require('bcrypt');

const {adminConnection} = require('../Config/connections_multi_mg');


const UserSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// xử lý dữ liệu trước khi tạo trong DB ( moongoose có hô trợ )
UserSchema.pre('save', async function(next){
    try{
        
        const salt = await bcrypt.genSalt(10);
        
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        next();

    }catch(error){
        next('doan nay cx dang sai vi du lieu rong' + error);
    }
})

UserSchema.methods.comparePassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);
    }catch(error){
        console.log(error);
        return false;
    }
}

module.exports = adminConnection.model('user', UserSchema)
