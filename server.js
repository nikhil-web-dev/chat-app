const express = require('express')
const path = require('path') 
const http = require('http')
const socketio = require('socket.io')
const {userConnect, currentUsers, currentUser, userDisconnect} = require('./utils/user')
const chatMessage = require('./utils/chat')
var crypto = require('crypto');
const { LOADIPHLPAPI } = require('dns')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', socket => {

    //when user connects or joins room
    socket.on('roomConnect',({username, room})=>{
        //add user in function userConnect -- user.js

        if(username == undefined || username == ""){
            socket.emit('usernameUndefined')
            return "Can't Proceed" ;
        }
        console.log(username);
        
        //creating random string for room name
        if(room === undefined){
        var randomNo = Math.floor((Math.random() * 300) + 1);
        var randomStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        var mykey = crypto.createCipher('aes-128-cbc', randomNo + randomStr);
        var mystr = mykey.update('abc', 'utf8', 'hex')
        room = mykey.final('hex');
        }
        console.log(room);
    

        

        const addUser = userConnect(username, room, socket.id);

        //join room
        socket.join(addUser.room);

         //send welcome text
        socket.emit('welcomeText', `welcome ${addUser.username}`);  

        //send connected message
        socket.broadcast.to(room).emit('connect_message', `${addUser.username} has connected`);

        //Send Users and Room Info
        io.to(addUser.room).emit('currentActiveUsers', {
            users: currentUsers(addUser.room),
            room: addUser.room,
        });
    })

    //Listen for chatMessage
    socket.on('chatText', (text) => {
        const user = currentUser(socket.id);
        console.log(user);
        
        io.to(user.room).emit('chat_message', chatMessage(user.username, text))
    })


    //When user disconnects
    socket.on('disconnect', () => {
        const user = userDisconnect(socket.id);

        if (user) {
            io.to(user.room).emit('disconnect_message', `${user.username} has left`);

            //Send Users and Room Info
            io.to(user.room).emit('currentActiveUsers', {
                users: currentUsers(user.room)
            });
        }
        
        
    });

})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(PORT));
