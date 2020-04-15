//Include libraries and files
const mongoose      = require("mongoose");
const bot           = require("./index.js")

//Init connect to local MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/casino', {useNewUrlParser: true, useUnifiedTopology: true });

//Make connection to db
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
    console.log("DB connected!");
});

//Create Schema shrtcut
const Schema = mongoose.Schema;

//Create Schema for users
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

//Init User model
let User = mongoose.model('User', userSchema);

//Check is user registered
//If user not registered call 'callback_InsertUser' else call 'callback_UserRegistered'
function isUserExist(id, callback_InsertUser, callback_UserRegistered) {
  User.find({ id: id}, function(err, data) {
    if (data.length == 0) {
      callback_InsertUser();
    } else {
      callback_UserRegistered();
    }
  });
}

//Write user info into DB with callback
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

//Change user money amount
async function changeUsersMoney(id, money) {
  let doc = await User.findOne({ "id": id })
  await User.findOneAndUpdate({ "id": id }, { "money": (doc.money+money)});
}

//Check is user have enogh money
//if enogh call 'callback_Enough' else call 'callback_NotEnough'
async function ifEnoghMoney(id, money, callback_Enough, callback_NotEnough) {
  if (money < 0) {
    let doc = await User.findOne({ "id": id });
    (doc.money > Math.abs(money)) ? callback_Enough() : callback_NotEnough();
  } else {
    callback_Enough()
  }
}

//Get user id by username
module.exports.userInfo = function (ctx, username) {
  User.findOne({ "username": username}, function(err, data) {
    bot.sendMessage(ctx.update.message.from.id, `${username}: ${data}`);
  });
}

//Run this function on '/start' command
module.exports.onStart = function (ctx) {
  isUserExist(ctx.update.message.from.id, ()=> {
    if (ctx.update.message.from.username != undefined) {
      insertUser(ctx.update.message.from, ()=> {
        bot.sendMessage(ctx.update.message.from.id, "Welcome new user!")
      })
    } else {
      bot.sendMessage(ctx.update.message.from.id, "Set username in profile, please! I need it to identfy you :)")
    }
  }, ()=> {
    bot.sendMessage(ctx.update.message.from.id, "User already registered!")
  })
}

module.exports.changeUsersMoney = function (ctx, idToAdd, money) {
  //changeUsersMoney(id, money);
  ifEnoghMoney(idToAdd, money, () => {
    changeUsersMoney(idToAdd, money)
  }, ()=> {
    console.log("Not enough money")
  })
}
