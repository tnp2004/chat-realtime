const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const pastelColor = require("pastel-color");
const randomstring = require("randomstring");
let userCount = 0;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
    const colors = pastelColor.getPastelColor(randomstring.generate());
    socket.on('newuser', user => {
        userCount++;
        console.log(`${user} has connected`)
        io.emit('usercount', userCount)

        socket.on('disconnect', () => {
            userCount--;
            console.log(`${user} has disconnected`)
            socket.broadcast.emit('usercount', userCount)
        })
    })

    socket.on('chat message', data => {
        console.log(data)
        io.emit('chat message', {
            username: data.username,
            msg: data.msg,
            color: colors.hex
        })
    })

    socket.on('typing', username => {
        socket.broadcast.emit('typing', {
            username: username,
            color: colors.hex
        })
    })

})

http.listen(3000, () => {
    console.log('server on port 3000')
})