const { Telegraf } = require("telegraf");
require("dotenv").config();
const mongoose = require("mongoose");
const Team = require("./model");

async function c2db() {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/premierleague-table")
    .then(() => console.log("connected."))
    .catch(() => console.log("couldn't connect."));
}

async function findTeams(bot) {
  const team = await Team.find();
  team.forEach((e) => {
    bot.hears(e.Club.toLowerCase(), (ctx) => {
      // console.log(e.Club)
      let text = "";
      for (let key in e["_doc"]) {
        if (key != "_id" && key != "__v" && key != "Next_Match") {
          console.log(key, e[key]);
          text += `${key} : ${e[key]} \n`;
        }
      }
      // console.log(text)
      
      ctx.reply(text);
    });
  });
}

function startBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start((ctx) => ctx.reply(`HI ${ctx.update.message.from.first_name}`));
    
  findTeams(bot);

  bot.launch();
}

c2db();

startBot();
