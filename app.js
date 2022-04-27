const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookiePaser = require('cookie-parser');
const database = require('./db');
const {validUser} = require("./middleware/auth");
require("dotenv").config();

const app = express();
const salt = 12;
const port = 3001

app.use(express.json());
app.use(cookiePaser());
app.use(express.urlencoded({extended: false}));

app.get('/users', validUser, (req, res) => {
    res.send(database);
});

app.get('/test', validUser, (req,res)=> {
    res.send("인증됨");
})

app.post('/signup', async (req, res) => {
    const {username, password, birthday} = req.body;
    const hash = await bcrypt.hash(password, salt);
    database.push({
        id: database.length,
        username,
        password: hash,
        birthday,
    });
    res.send("success");
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = database.filter((user) => user.username === username);

    if (user.length === 0) {
        res.status(403).send('해당하는 아이디가 없습니다!');
        return
    }

    const match = await bcrypt.compare(password, user[0].password);

    if (match === false) {
        res.status(403).send('비밀번호가 틀렸습니다.');
        return
    }
    const access_token = jwt.sign({username}, process.env.SECRET_KEY);
    res.cookie('access_token', access_token, {httpOnly: true});
    res.send("로그인 성공");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})