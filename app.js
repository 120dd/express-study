const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('./db');
const { validUser } = require("./middleware/auth");
const cors = require('cors');
require("dotenv").config();

const app = express();
const salt = 12;
const port = 3001;

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.urlencoded({ extended: false }));

app.get('/getUserInfo' , validUser , (req,res ) => {
    const {signup_date,id,username,birth} = req.decoded;
    const data = {
        signup_date,
        id,
        username,
        birth
    }
    return res.status(200).json({
        code: 200,
        message: '정상 토큰입니다.',
        data
    })
});

app.post('/signup' , async ( req , res ) => {
    const { id , password , birth, username } = req.body;
    const hash = await bcrypt.hash(password , salt);
    const dateTime = new Date();
    database.push({
        signup_date: dateTime,
        id: id ,
        password: hash ,
        username,
        birth
    });
    res.send("success");
})

app.post('/login' , async ( req , res ) => {
    const { id , password } = req.body;
    const user = database.filter((userdata) => String(userdata.id) === String(id));

    if (user.length === 0) {
        res.status(403).send('해당하는 아이디가 없습니다!');
        return
    }

    const match = await bcrypt.compare(password , user[ 0 ].password);

    if (match === false) {
        res.status(403).send('비밀번호가 틀렸습니다.');
        return
    }
    const userData = {
        id: user[ 0 ].id ,
        username: user[0].username,
        signup_date: user[0].signup_date,
        birth: user[0].birth,
    }
    const access_token = jwt.sign({
        type: 'JWT',
        ...userData,
    } , process.env.SECRET_KEY,{
        expiresIn: '15m',
        issuer: 'chris'
    });
    res.status(200).json({
        code: 200,
        msg: "토큰이 발급되었습니다",
        access_token
    });
})

app.listen(port , () => {
    console.log(`Example app listening on port ${port}`)
})