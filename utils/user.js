const users = [];

function userConnect(username, room, id){
    const userInfo = {username, room, id}

    users.push(userInfo)
    return userInfo
    
}

function currentUsers(room){
    return users.filter(user => user.room === room);
}

function currentUser(id){
    return users.find(user => user.id === id);
}

function userDisconnect(id){
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    userConnect,
    currentUsers,
    currentUser,
    userDisconnect
}