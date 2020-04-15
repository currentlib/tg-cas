const low   = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

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
  
  
  
  
  
  
  
module.exports.initDice = function (num) {
    initDice(num)
}