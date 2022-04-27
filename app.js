const express = require('express')
const app = express()
const port = 3001

const database = [
    {id: 1, title: '글1'},
    {id: 2, title: '글2'},
    {id: 3, title: '글3'},
]

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// http://localhost:3001 에서 구동
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/database', (req, res) => {
    res.send(database);
})

app.get('/database/:id', (req, res) => {
    const id = req.params.id;
    const data = database.find((el) => el.id === Number(id));
    res.send(data);
})

app.patch('/database', (req, res)=>{
    const id = req.body.id;
    const data = database.find((el) => el.id === Number(id));
    req.body.title && (data.title = req.body.title);
    req.body.newId && (data.id = req.body.newId);
    res.send(data);
})

app.put('/database', (req, res) => {
    const title = req.body.title;
    database.push({
        id: database.length + 1,
        title,
    });
    res.send('값 추가완료');
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})