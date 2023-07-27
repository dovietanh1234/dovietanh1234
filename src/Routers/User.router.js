const express = require('express');
const route = express.Router();
//const bcrypt = require('bcrypt');
const { verifyAccessToken} = require('../Service/jwt_service');
const {register, refreshToken, login, logout, list} = require('../Controllers/User.controller')


route.post('/register', register);

route.post('/refreshToken', refreshToken);

route.post('/login', login);

route.delete('/logout', logout);

route.get('/list', verifyAccessToken, list);


module.exports = route;