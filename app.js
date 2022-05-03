const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookiePaser = require('cookie-parser');
const database = require('./db');
const { validUser } = require("./middleware/auth");
const cors = require('cors');
require("dotenv").config();

const app = express();
const salt = 12;
const port = 3001

app.use(express.json());
app.use(cors());
app.use(cookiePaser());
app.use(express.urlencoded({ extended: false }));

app.get('/users' , validUser , (req,res ) => {
    res.send(database);
});

app.get('/test' , validUser , ( req , res ) => {
    res.send("인증됨");
})

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
    const access_token = jwt.sign({ id } , process.env.SECRET_KEY);
    res.cookie('access_token' , access_token , { httpOnly: true });
    const userData = {
        id: user[ 0 ].id ,
        username: user[0].username,
        signup_date: user[0].signup_date,
        birthDay: user[ 0 ].birthday,
    }
    res.send(userData);
})

app.listen(port , () => {
    console.log(`Example app listening on port ${port}`)
})