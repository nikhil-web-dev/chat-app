const chatForm = document.getElementById('chat-form');
const showMessage = document.querySelector('.message_box')
const activeList = document.querySelector('.active-users')
const notificationMsg = document.querySelector('.notify')
const welcomeMsg = document.getElementById('welcome_head')
const messageBox = document.querySelector('.chat_messages')
const messageContainer = document.querySelector('.chat_messages_container')
const shareUrl = document.querySelector('.share-url')

const socket = io();

var { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(location.host);

//when user connects room
socket.emit('roomConnect',{username, room})

//chat message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get message text
    const text = e.target.elements.chatText.value;

    //emit chat texts
    socket.emit('chatText', text)

 
     
    //clear textarea
    e.target.elements.chatText.value = '';
    e.target.elements.chatText.focus();

    
 
});

socket.on('usernameUndefined',() => {
    askUsername();
})

askUsername = () => {
    var txt;
    var username = prompt("Please enter your name:", "Harry Potter");
    if (username == null || username == "") {
      txt = "Username Required.";
    } 

    socket.emit('roomConnect',{username, room})
}

socket.on('chat_message', chat =>{
  showChatMessage(chat)  
})

//welcome user --- from server
socket.on('welcomeText', message => {
    welcomeMsg.innerHTML = `${message}`    
  
});

//Get connection message
socket.on('connect_message', connect_message =>{
    notificationMsg.innerHTML = `<p><b>${connect_message}</b></p>`    
})

socket.on('disconnect_message', disconnect_message =>{
    notificationMsg.innerHTML = `<p><b>${disconnect_message}</b></p>`
})

//Get User Details
socket.on('currentActiveUsers', ({ users, room }) => {
   showUserDetails(users);
   showRoomDetails(room);
});

//room details
showRoomDetails = (room) => {
console.log(room);
shareUrl.innerHTML = `<input type="text" value="${location.host}/chat.html?room=${room}" id="setUrl" readonly> 
<button class="btn btn-dark" onclick="copyUrl()"> Copy text</button>`;
}

//show user details, to chat.html
showUserDetails = (users) => {
    console.log(users);
    
    activeList.innerHTML =
    `${users.map(user => `<li> ${user.username} </li>`).join('')} `;   
}

showChatMessage = (chat) => {

    const div = document.createElement('div');

    div.classList.add('message_box');

    div.innerHTML = `<span class="text-info incoming_msg_img">${chat.username}</span> <br> 
                    <p>${chat.chatMsg}</p>
                    <span class="time_date"> ${chat.time} </span>`
    
    messageBox.appendChild(div);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
