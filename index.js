//Include
const Telegraf  = require("telegraf")
const login     = require("./login.js")
const dice      = require("./diceGame")
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
  //dice.initDB()
  //this.sendDice(ctx);
  //ctx.replyWithDice().then((data)=> {console.log(data.dice.value)});
});

bot.command("addMoney", (ctx) => {
  console.log("Adding " + ctx.update.message.text.split(" ")[1] + " for user " + ctx.update.message.from.username)
  login.changeUsersMoney(ctx.update.message.from.id, parseInt(ctx.update.message.text.split(" ")[1], 10))
})


bot.command("playDice", (ctx) => {

})


function printNumber(number) {
  console.log(number);
}



bot.launch()



//login.onStart()


module.exports.sendMessage = function (ctx, msg) {
  ctx.reply(msg);
}

module.exports.sendDice = function (ctx) {
  ctx.replyWithDice().then((msg) => {printNumber(msg.dice.value)});
}
