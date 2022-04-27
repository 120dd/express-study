const database = require('../db');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const validUser = (req, res, next) => {
    const {access_token} = req.cookies;
    if (!access_token) {
        res.status(401).send("accesstoken이 없습니다");
    }
    try {
        const {username} = jwt.verify(access_token, process.env.SECRET_KEY);
        const userInfo = database.find((data) => data.username === username);

        if (!userInfo) {
            throw "userinfo가 없습니다";
        }

        next();
    } catch (e) {
        res.status(401).send('유효하지않은 유저입니다');
    }
};

module.exports = {
    validUser,
};