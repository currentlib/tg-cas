const low   = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

const adapter = new FileSync('db.json')
const db = low(adapter)


async function newRoom() {
  await db.get("dice").push({ id: db.get("roomsCount").value(), players: []}).write()
  await db.update("roomsCount", n=> n=db.get("dice").value().length).write()
}





function initDB() {
  db.defaults({roomsCount: 0, dice: []}).write()
}







module.exports.initDB = function () {
  newRoom()
}