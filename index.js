const Telegraf  = require('telegraf')
const login     = require("./login.js")

const bot = new Telegraf("552905592:AAFCbkNfdc2zn7ABBv7T1dKAg7RJuXOhC78")
bot.start((ctx) => {
    console.log(ctx.update.message)
    let message = login.onStart(ctx.update.message)
    ctx.reply(message)
})
bot.launch()

//login.onStart()
