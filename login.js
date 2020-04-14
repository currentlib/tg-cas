const mongoose      = require("mongoose");
const bot           = require("./index.js")

mongoose.connect('mongodb://127.0.0.1:27017/casino', {useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
    console.log("DB connected!");
});


const Schema = mongoose.Schema;

let userSchema = new Schema({
    id: Number,
    username: String,
    firstName: String,
    lastName: String,
    lang: String,
    money: Number,
    checkpoint: String,
    date: Date
});

let User = mongoose.model('User', userSchema);

function isUserExist(id, callback_InsertUser, callback_UserRegistered) {
  console.log("In isUserExist");
  User.find({ id: id}, function(err, data) {
    if (data.length == 0) {
      callback_InsertUser();
    } else {
      callback_UserRegistered();
    }
  });
}

function insertUser(from, callback_NewUser) {
  console.log("Test")
    let user = new User({
        id: from.id,
        username: from.username,
        firstName: from.first_name,
        lastName: from.last_name,
        lang: from.language_code,
        money: 100,
        checkpoint: "registration",
        date: Date.now()
    });

    user.save((err, user) => {
        if (err) { return console.error(err) }
        else { callback_NewUser() };
    })
}

module.exports.onStart = function (ctx) {
  isUserExist(ctx.update.message.from.id, ()=> {
    insertUser(ctx.update.message.from, ()=> {
      bot.sendMessage(ctx, "Welcome new user!")
    })
  }, ()=> {
    bot.sendMessage(ctx, "User already registered!")
  })
}
