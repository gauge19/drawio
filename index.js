const PORT = process.env.PORT || 9000;

const express = require('express')
const path = require("path")
const fetch = require("node-fetch")

const app = express();
const server = require('http').createServer(app);
const options = {};

const io = require('socket.io')(server, options);

// search for uuid
const rooms = io.of(/^\/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)

rooms.on('connection', socket => {
    const room = socket.nsp

    room.send("hello")
})

app.use(express.static('pages/public'));

// send room files
app.get('/room/main.css', (req, res) => res.sendFile(path.join(__dirname, "pages", "room", "main.css")))
app.get('/room/main.js', (req, res) => res.sendFile(path.join(__dirname, "pages", "room", "main.js")))
app.get('/room/:room_id', (req, res) => {
    console.log(req.params)
    res.sendFile(path.join(__dirname, "pages", "room", "index.html"))
})

app.get('/api/uuid', (req, res) => {
    fetch("https://www.uuidgenerator.net/api/version4")
        .then(res => {
            if (res.ok) return res.text()
            else throw Error("error", res)
        })
        .then(data => {
            //console.log(data);
            res.send(data)
        })
        .catch(err => res.send(err))
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));