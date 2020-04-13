const low       = require('lowdb')
const FileSync  = require("lowdb/adapters/FileSync")

const adapter = new FileSync('db.json')
const db = low(adapter)

function registrationCheck(userId) {
    let userToCheck = db.get("user").find({ id: userId}).value()
    return userToCheck == undefined
}

function registration(from) {
    db.get("user").push({
        id: from.id, 
        username: from.username,
        firstName: from.first_name,
        lastName: from.last_name,
        lang: from.language_code,
        money: 100
    }).write()

}

function initDB() {
    db.defaults({
        user: [],
        room: []
    }).write()

    db.get('user').push({ name: "Test"}).write()
}

function generateUsers() {
    for (let i=0; i<1000; i++) {
        db.get("user").push({
            id: i, 
            username: "from.username",
            firstName: "from.first_name",
            lastName: "from.last_name",
            lang: "from.language_code",
            money: 100
        }).write()
    }
}


module.exports.onStart = function (message) {
    //generateUsers()
    if (registrationCheck(message.from.id)) {
        registration(message.from)
        return `Registration completed
    Infomation about you:
        Username: ${message.from.username}
        First name: ${message.from.first_name}
        Last name: ${message.from.last_name}`
    } else {
        return `User already exist
    Infomation about you:
        Username: ${message.from.username}
        First name: ${message.from.first_name}
        Last name: ${message.from.last_name}`
    }
}