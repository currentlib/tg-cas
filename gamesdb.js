const low   = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const test = require("./db.json")

const adapter = new FileSync('db.json')
const db = low(adapter)


async function newRoom(roomsNumber) {
    await db.get("dice").push({ id: db.get("roomsCount").value(), players: []}).write()
    await db.update("roomsCount", n => n=db.get("dice").value().length).write()
}


async function initDice(roomsNumber) {
    await db.defaults({roomsCount: 0, dice: []}).write()
    let number = parseInt(await db.get("dice").value().length)
    console.log(`Number ${roomsNumber-number}`)
    for (let i=(number); i<(number+roomsNumber); i++) {
        console.log(`Add ${i}`);
        await newRoom()
    }
}
  

function testfunc(){
    console.log(test.dice[0])
}

function addPlayerToRoom(id) {
    let isPlayer = isPlayerInRoom(id);

    if (!isPlayer) {
        for (let i=0; i<db.get("dice").value().length; i++) {
            let room = db.get("dice").value()[i]
            if (room.players.length < 5) {
                let players = db.get("dice").find({id: i}).value().players
                players.push(id);
                db.get("dice").find({id: i}).update({'players': p => p=players}).write()
                console.log(`Player ID: ${id} added in room ${i}`)
                return true
            }
        }
    }
}


function removePlayerFromRoom(id) {
    let isPlayer = isPlayerInRoom(id);

    if(isPlayer) {
        for (let i=0; i<db.get("dice").value().length; i++) {
            let room = db.get("dice").value()[i]
            if (room.players.length < 5) {
                let players = db.get("dice").find({id: i}).value().players
                players.remove(id);
                db.get("dice").find({id: i}).update({'players': p => p=players}).write()
                console.log(`Player ID: ${id} removed from room ${i}`)
                return true
            }
        }
    }
}

function isPlayerInRoom(id) {
    let ret = false;
    let msg = `Player ID: ${id} does not exist in any room.`
    for (let i=0; i<db.get("dice").value().length; i++) {
        let players = db.get("dice").find({id: i}).value().players;
        players.forEach((player)=> {
            if (player == id) {
                msg = `Player ID: ${id} exist in room ${i}`
                ret = true;
            }
        })
    }
    console.log(msg);
    return ret;
}



  
  
module.exports.initDice = function (num) {
    initDice(num)
}

module.exports.addPlayer = function(id) {
    //removePlayerFromRoom(id)
    addPlayerToRoom(id)
    //testfunc();
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};