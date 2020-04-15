//Include
const Telegraf  = require("telegraf")
const login     = require("./login.js")
const gamesdb      = require("./gamesdb.js")
const config    = require("./config.json")

//
const bot = new Telegraf(config.bot)
bot.start((ctx) => {
    //console.log(ctx.update.message)
    login.onStart(ctx)
})


bot.command("test", (ctx) => {
  login.changeUsersMoney(ctx.update.message.from.id, -15)
  ctx.reply(ctx.update.message.text)
  //gamesdb.initDB()
  //this.sendDice(ctx);
  //ctx.replyWithDice().then((data)=> {console.log(data.dice.value)});
});


bot.command("addMoney", (ctx) => {
  let msg = ctx.update.message.text.split(" ");
  if (msg.length == 2) {
    console.log("Adding " + msg[1] + " for user " + ctx.update.message.from.username)
    login.changeUsersMoney(ctx, ctx.update.message.from.id, parseInt(msg[1], 10))
  } else if (msg.length == 3) {
    console.log("Adding " + msg[2] + " for user " + msg[1])
    login.changeUsersMoney(ctx, msg[1], parseInt(msg[2], 10))
  } else {
    ctx.reply("Wrong command or parameters! '/addMoney <money>' or '/addMoney <userId> <money>'")
  }
})


bot.command("initDice", (ctx) => {
  let msg = ctx.update.message.text.split(" ")
  if (msg.length == 2) {
    gamesdb.initDice(parseInt(ctx.update.message.text.split(" ")[1], 10))
  } else {
    ctx.reply("Wrong command or parameters! '/initDice <number of rooms>'")
  }
})


bot.command("userInfo", (ctx) => {
  if (isAdmin(ctx.update.message.from.id)) {
    let msg = ctx.update.message.text.split(" ")
    if (msg.length == 2) {
      login.userInfo(ctx, ctx.update.message.text.split(" ")[1])
    } else {
      ctx.reply("Wrong command or parameters!")
    }
  } else {
    ctx.reply("You are not admin!")
  }
})


bot.command("playDice", (ctx) => {

})


function printNumber(number) {
  console.log(number);
}


function isAdmin(id) {
  return config.admins.includes(id);
}


bot.launch()




module.exports.sendMessage = function (ctx, msg) {
  ctx.reply(msg);
}

module.exports.sendDice = function (ctx) {
  ctx.replyWithDice().then((msg) => {printNumber(msg.dice.value)});
}
