const Telegraf  = require('telegraf')
const login     = require("./login.js")

const bot = new Telegraf("552905592:AAFCbkNfdc2zn7ABBv7T1dKAg7RJuXOhC78")
bot.start((ctx) => {
    //console.log(ctx.update.message)
    login.onStart(ctx)
})
bot.command("test", (ctx) => {
  this.sendDice(ctx);
  //ctx.replyWithDice().then((data)=> {console.log(data.dice.value)});
});
//bot.command("")

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
