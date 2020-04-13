const MongoClient   = require("mongodb").MongoClient
const assert        = require("assert")

var db        = undefined
var dbUrl           = "mongodb://127.0.0.1:27017"
var dbName          = "casino"
MongoClient.connect(dbUrl, { useUnifiedTopology: true },function(err, client) {
    if (err) {
        throw err
    } else {
        console.log("MongoDB connection successful")
        db = client.db(dbName)
        insertDocuments(db, function() {
            client.close() 
        })       
    }
});


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


const insertDocuments = function (db, callback) {
    const collection = db.collection('users');
    collection.insertMany([{a: 1}, {a: 2}, {a: 3}],
        function(err, result) {
            assert.equal(err, null)
            assert.equal(3, result.result.n)
            assert.equal(3, result.ops.length)
            console.log("Inserted 3 documents into the collection")
            callback(result)
        })
}

module.exports.onStart = function (message) {

    

    /*//generateUsers()
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
    }*/
}