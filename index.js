const express = require("express");
const app = express();
const Discord = require("discord.js");
const cron = require('cron');
const bodyParser = require("body-parser");
const Database = require("@replit/database")

app.use(bodyParser.urlencoded({ extended: true })); //to parse 

const updatedRoutine = [];
//const prefix = '?';
var date = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" }));

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var todayDay = days[date.getDay()];
var tomorrowDay = days[(date.getDay() + 1) % 7];
var enable = false;

var data = require('./data2.1.json');

app.listen(3000, () => {
  console.log("capybara smug");
})
app.get("/", (req, res) => {
  res.send("Yo Yo Yo capybot in the house");
})
app.post("/", (req, res) => {
  let data = req.body;
  res.send('Data Received: ' + JSON.stringify(data));
  updatedRoutine.push(data);
  console.log(data);
  console.log(updatedRoutine);
})

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const db = new Database();
// Create a map to store the last search timestamp for each user
const coolDownMap = new Map();

// Function to simulate rolling a die
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}
function millionDie() {
  return Math.floor(Math.random() * 1000000) + 1;
}
function calculateIncreasedCapacity(winnings) {
  const percentageIncrease = 10;
  return Math.floor(winnings * (percentageIncrease / 100));
}


client.on("ready", () => {
  console.log("The bot is online!");

  //works
  // Set bot's presence
  client.user.setPresence({
    activities: [
      {
        name: 'Re:Enabling Gambling Addictions',
        type: 'PLAYING',
      },
    ],
    status: 'online',
    cache: false,
  });

  //this needs to be kept here to make sure the bot is fully ready before attempting to cache the channel 
  //973223019562561656
  //972853526529196045 //#general 's Channel ID
  const channelIdToPing = "972853526529196045";
  const channelToPing = client.channels.cache.get(channelIdToPing);

  // minute hour "day of month" "month" "day of week (can be separated by commas)" format for time
  //what timezone is this using? idk let's check //it's using UTC
  // 1 = Monday 6:15, 4 = Thursday 6:15
  const job = new cron.CronJob('15 18 * * 1,4', () => {
    if (channelToPing && enable) {
      channelToPing.send("Go to college <@763011296987578418>");
    }
  });
  job.start();

  //custom message
  if (channelToPing && 0) {
    channelToPing.send("Yo");
  }

  //dishan threatener
  /*
    const messageId = "1131976194879926433";
  
    client.channels.fetch(channelIdToPing)
      .then(channel => {
        if (channel.isText()) {
          channel.messages.fetch(messageId)
            .then(message => {
              message.reply("");
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  */
});

function logKeys() {
  const allKeys = db.list();
  // Log all keys to the console
  console.log("List of all keys:");
  for (const key of allKeys) {
    console.log(key);
  }
  db.delete("");
}

//message responders
client.on("messageCreate", async(message) => {
  //admin lock
  //  if (!message.member.permissions.has("ADMINISTRATOR")) return;
  
  /*
  //prefix test ; works but I can't seem to find a suitable prefix 
  if(message.content.startsWith(prefix))
  {
    var command = message.content.slice(prefix.length).trim().split(" ")[0];
    if (command === "ping") {
      message.reply("pong");
    }
  }
  */

  if (message.author.bot) return;
  
  //GENERAL COMMANDS
  if (message.content === "ping") {
    message.reply("pong")
  }
  if (message.content === "vim") {
    message.reply("Top 11 reasons why neovim is better than vim:\n\n0. It's built different\n1. Vim isn't open-source\n2. Lua >>> vimscript");
  }
  //routine replier
  if (message.content.toLowerCase() === "routine" && enable) {
    a = "";

    data.forEach(item => {
      if ("Saturday" === todayDay) {
        a = "No routine for today!"
      } else if (updatedRoutine.length > 0) {
        updatedRoutine.forEach(item => {
          if (item.date === date.toISOString().split('T')[0]) {
            a += "Subject: " + item.subject + "(" + item.category + ")" + "\nTeacher: " + item.teacher + "\nStart Time: " + item.start_time + "\nEnd Time: " + item.end_time + "\n\n";
          }
        });
      } else if (item.day === todayDay) {
        a += "Subject: " + item.subject + "(" + item.category + ")" + "\nTeacher: " + item.teacher + "\nStart Time: " + item.start_time + "\nEnd Time: " + item.end_time + "\n\n";
      }
    });

    message.reply(a);
  }
  else if (message.content.includes("routine") && message.content.includes("tomorrow") && enable) {
    a = "";

    data.forEach(item => {
      if ("Saturday" === tomorrowDay) {
        a = "No routine for saturday!"
      }
      else if (updatedRoutine.length > 0) {
        updatedRoutine.forEach(item => {
          if (item.date === date.toISOString().split('T')[0]) {
            a += "Subject: " + item.subject + "(" + item.category + ")" + "\nTeacher: " + item.teacher + "\nStart Time: " + item.start_time + "\nEnd Time: " + item.end_time + "\n\n";
          }
        });
      }
      else if (item.day === tomorrowDay) {
        a += "Subject: " + item.subject + "(" + item.category + ")" + "\nTeacher: " + item.teacher + "\nStart Time: " + item.start_time + "\nEnd Time: " + item.end_time + "\n\n";
      }
    });

    //to see why this is added write "routine tomorrow" on a saturday without this check
    message.reply(a);
  }

  if (message.content === "day") {
    //check the day before every message
    todayDay = days[date.getDay()];
    message.reply("Today is " + todayDay + "\n Index = " + date.getDay());
  }

  if (message.content === "tomorrowDay") {
    //check the day before every message
    tomorrowDay = days[(date.getDay() + 1) % 7];
    message.reply("Tomorrow is " + tomorrowDay);
  }

  if (message.content === "time") {
    message.reply(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
  }
  //replies with the instructions to make a sandwich
  if (message.content === "sandwich") {
    message.reply("Ingredients\n\n4 thick slices of focaccia or 8 slices of bread, to serve\n2 tbsp basil pesto (ensure vegetarian, if needed)\n2 tsp extra virgin olive oil\nhandful of rocket\n2 x 125g balls of mozzarella, sliced (ensure vegetarian, if needed)\n2 large ripe tomatoes, sliced\nsmall handful of basil leaves\n1⁄2 small red onion, sliced (optional)\n2 tsp thick balsamic vinegar\n\n\n\nMethod\n\nSTEP 1\nIf using focaccia, cut the slices across the middle so you have a total of eight slices. Spread 1/4 tbsp pesto over four of the focaccia or bread slices, and drizzle each of the remaining four slices with 1/2 tsp olive oil.\n\nSTEP 2\nDivide the rocket, mozzarella, tomatoes, basil leaves and red onion slices over the pesto-topped focaccia or bread. Drizzle 1/4 tsp balsamic vinegar over each of the remaining slices. Sandwich the slices together, wrap up for a picnic or serve straightaway. Best eaten on the day they’re made.\n");
  }
  if (message.content.toLowerCase() == "cookie") {
    let userMention = `<@${message.author.id}>`;
    message.reply(`${userMention} gets a cookie 🍪`);
  }

  //ADMIN COMMANDS
  if (message.member.permissions.has("ADMINISTRATOR")) {
    if (message.content.toLowerCase() === "enable routine") {
      enable = true;
      message.reply("Routine related functions have been enabled");
    }
    else if (message.content.toLowerCase() === "disable routine") {
      enable = false;
      message.reply("Routine related functions have been disabled");
    }
    else if (message.content == "funds pls am admin") {
      const userId = message.author.id;
      let userBalance = await db.get(userId) || 0;
      userBalance += 5000;
      await db.set(userId, userBalance);
      message.channel.send("Yes creator");
    }
    else if (message.content == "shut up capy") {
      message.channel.send("Yes creator");
    }
    else if(message.content == "logKeys")
    {
      logKeys();
    }
  }

  //illegal gambling game
  // Command to gamble
  if (message.content.toLowerCase().startsWith("gamble")) {
    const args = message.content.split(" ");
    if (args.length === 1) {
      message.reply("Usage: gamble <amount> or gamble all");
      return;
    }

    const userId = message.author.id;
    var userBalance = await db.get(userId) || 0;
    let userBankCapacity = await db.get(`bankCapacity_${userId}`) || 1000;

    let gambleAmount;
    if (args[1].toLowerCase() === "all") {
      gambleAmount = userBalance;
    }
    else {
      gambleAmount = parseInt(args[1]);
      if (isNaN(gambleAmount) || gambleAmount <= 0) {
        message.reply("Invalid gamble amount.");
        return;
      }
    }

    if (!userBalance || userBalance < gambleAmount) {
      message.reply("Nice try, sadly you can't gamble your imaginary wealth.");
      return;
    }

    // Deduct the gamble amount from the user's wallet
    userBalance -= gambleAmount;
    await db.set(userId, userBalance);

    // Roll dice for the user and the bot and calculate the totals for them
    const userTotal = rollDie() + rollDie();
    const botTotal = rollDie() + rollDie();

    let resultMessage = '';
    let color = '';

    if (userTotal > botTotal) {
      const winnings = gambleAmount * 2.5;
      const updatedBankCapacity = userBankCapacity + calculateIncreasedCapacity(winnings);

      await db.set(userId, userBalance + winnings);
      await db.set(`bankCapacity_${userId}`, updatedBankCapacity);

      resultMessage += `You won **${winnings}** electrons.\n\nNew balance is **${userBalance + winnings}** electrons.`;
      color = '#00ff00';
    }
    else if (userTotal < botTotal) {
      resultMessage += `You lost **${gambleAmount}** electrons.\n\nNew balance is **${userBalance}** electrons.`;
      color = '#ff0000'
    }
    else {
      userBalance += gambleAmount;
      await db.set(userId, userBalance);
      resultMessage += `You both rolled the same number.\nYour bet will be refunded.\n\nNew balance is **${userBalance}** electrons.`;
      color = '#000000';
    }

    const gambleEmbed = new Discord.MessageEmbed()
      .setTitle(`**${message.author.username}'s Gambling game**`)
      .setDescription(resultMessage)
      .setColor(color)
      .addFields(
        { name: `${message.author.username}`, value: `Rolled **${userTotal}**`, inline: true },
        { name: 'Capybot', value: `Rolled **${botTotal}**`, inline: true }
      );
    message.channel.send({ embeds: [gambleEmbed] });
  }

  // Command to check wallet balance and bank balance
  if (message.content.toLowerCase() === "balance") {
    const userId = message.author.id;
    const userBalance = await db.get(userId) || 0;
    const userBankCapacity = await db.get(`bankCapacity_${userId}`) || 1000;
    const userBankBalance = await db.get(`bankBalance_${userId}`) || 0;

    // Create an embed for the user's balance
    const balanceEmbed = new Discord.MessageEmbed()
      .setTitle('Balance')
      .setColor('#ffd700')
      .addField('Bank', `**${userBankBalance}/${userBankCapacity}** electrons`, false)
      .addField('Pocket', `**${userBalance}** electrons`, false);

    message.channel.send({ embeds: [balanceEmbed] });
  }

  // Command to search for electrons
  if (message.content.toLowerCase() === "search") {
    const userId = message.author.id;
    let maxSearchReward = 150; // Maximum random reward for searching
    //one in a million chance to increase cap to a million
    if(millionDie() === 42) {maxSearchReward = 1000000;}

    const searchCooldownTime = 20000; // Cooldown time in milliseconds (30 seconds)
    // Check if the user is on cooldown
    if (coolDownMap.has(userId)) {
      const lastSearchTime = coolDownMap.get(userId);
      const currentTime = Date.now();

      if (currentTime - lastSearchTime < searchCooldownTime) {
        const remainingCooldown = (lastSearchTime + searchCooldownTime - currentTime) / 1000;
        message.reply(`Whoa Whoa slow down, please try again in ${remainingCooldown.toFixed(1)}s`);
        return;
      }
    }

    // Generate a random reward between 1 and maxSearchReward
    const searchReward = Math.floor(Math.random() * maxSearchReward) + 1;

    let userBalance = await db.get(userId) || 0;
    userBalance += searchReward;
    await db.set(userId, userBalance);

    // Update the last search timestamp for the user
    coolDownMap.set(userId, Date.now());

    message.channel.send(`You searched and found **${searchReward}** electrons. Your new balance is **${userBalance}** electrons.`);
  }

  // Command to show the richest users based on pocket balance
  if (message.content.toLowerCase() === "rich") {
    const userKeys = await db.list(); // Get a list of all user-related keys
    const userBalancesArray = [];

    // Fetch pocket balances for all users and create an array of objects
    for (const userKey of userKeys) {
      if (!userKey.startsWith("bank")) {
        const pocketBalance = await db.get(userKey) || 0; // Fetch pocket balance for the user
        userBalancesArray.push({ userId: userKey, balance: pocketBalance });
      }
    }

    // Sort the array in descending order based on pocket balance
    userBalancesArray.sort((a, b) => b.balance - a.balance);

    // Create an embed for the richest users
    const richestUsersEmbed = new Discord.MessageEmbed()
      .setTitle('Top 5 Richest Users')
      .setColor('#ffd700');

    for (let i = 0; i < 5 && i < userBalancesArray.length; i++) {
      const user = userBalancesArray[i];
      try {
        const discordUser = await client.users.fetch(user.userId);
        const username = discordUser.discriminator === '0' ? discordUser.username : discordUser.tag;
        richestUsersEmbed.addField(`#${i + 1}`, `User: ${username}\n**electrons: ${user.balance}**\n`, false);
      } catch (error) {
        console.error(`Error fetching user: ${user.userId}`);
      }
    }

    message.channel.send({ embeds: [richestUsersEmbed] });
  }

  // Command to deposit electrons to the bank
  if (message.content.toLowerCase().startsWith("deposit")) {
    const args = message.content.split(" ");
    if (args.length === 1) {
      message.reply("Usage: deposit <amount> or deposit all");
      return;
    }

    const userId = message.author.id;
    const userBalance = await db.get(userId) || 0;
    const userBankCapacity = await db.get(`bankCapacity_${userId}`) || 1000;
    const userBankBalance = await db.get(`bankBalance_${userId}`) || 0;

    if (args[1].toLowerCase() === "all") {
      const maxDepositAmount = Math.min(userBalance, userBankCapacity - userBankBalance); // Deposit as much as possible without exceeding bank capacity

      if (maxDepositAmount === 0) {
        message.reply("Deposited 0 electrons. Your bank capacity is already full.");
        return;
      }

      const updatedPocketBalance = userBalance - maxDepositAmount;
      const updatedBankBalance = await db.get(`bankBalance_${userId}`) || 0;
      await db.set(userId, updatedPocketBalance);
      await db.set(`bankBalance_${userId}`, updatedBankBalance + maxDepositAmount);

      message.channel.send(`Deposited **${maxDepositAmount}** electrons to the bank.`);
    }
    else {
      const depositAmount = parseInt(args[1]);
      if (isNaN(depositAmount) || depositAmount <= 0) {
        message.reply("Invalid deposit amount.");
        return;
      }

      if (depositAmount > userBalance) {
        message.reply("You don't have enough electrons in your pocket.");
        return;
      }

      const maxDepositAmount = Math.min(depositAmount, userBankCapacity - userBankBalance);
      // Deposit as much as possible without exceeding bank capacity

      if (maxDepositAmount === 0) {
        message.reply("Deposit amount exceeds your bank capacity.");
        return;
      }

      const updatedPocketBalance = userBalance - maxDepositAmount;
      const updatedBankBalance = await db.get(`bankBalance_${userId}`) || 0;

      await db.set(userId, updatedPocketBalance);
      await db.set(`bankBalance_${userId}`, updatedBankBalance + maxDepositAmount);

      message.channel.send(`Deposited **${maxDepositAmount}** electrons to the bank.`);
    }
}

  // Command to withdraw electrons from the bank
  if (message.content.toLowerCase().startsWith("withdraw")) {
    const args = message.content.split(" ");
    if (args.length === 1) {
      message.reply("Usage: withdraw <amount> or withdraw all");
      return;
    }

    const userId = message.author.id;
    const userBalance = await db.get(userId) || 0;
    const userBankBalance = await db.get(`bankBalance_${userId}`) || 0;

    if (args[1].toLowerCase() === "all") {
      if (userBankBalance === 0) {
        message.reply("You don't have any electrons to withdraw from your bank.");
        return;
      }

      const updatedPocketBalance = userBalance + userBankBalance;
      await db.set(userId, updatedPocketBalance);
      await db.set(`bankBalance_${userId}`, 0);

      message.channel.send(`Withdrawn **${userBankBalance}** electrons from the bank.`);
    }
    else {
      const withdrawAmount = parseInt(args[1]);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        message.reply("Invalid withdraw amount.");
        return;
      }

      if (withdrawAmount > userBankBalance) {
        message.reply("You don't have enough electrons in your bank.");
        return;
      }

      const updatedPocketBalance = userBalance + withdrawAmount;
      const updatedBankBalance = userBankBalance - withdrawAmount;

      await db.set(userId, updatedPocketBalance);
      await db.set(`bankBalance_${userId}`, updatedBankBalance);

      message.channel.send(`Withdrawn **${withdrawAmount}** electrons from the bank.`);
    }
}

  //Command to give electrons to another player
  if (message.content.toLowerCase().startsWith("give")) {
    const args = message.content.split(" ");
    if (args.length !== 3) {
      message.reply("Usage: give <@user> <amount>");
      return;
    }

    const userId = message.author.id;
    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
      message.reply("Please mention a valid user to give electrons to.");
      return;
    }
    const receiverId = mentionedUser.id;

    // Check if the mentioned user is the same as the sender
    if (receiverId === userId) {
      message.reply("You can't give electrons to yourself.");
      return;
    }

    const amount = parseInt(args[2]);
    if (isNaN(amount) || amount <= 0) {
      message.reply("Invalid amount.");
      return;
    }

    const senderBalance = await db.get(userId) || 0;
    if (amount > senderBalance) {
      message.reply("You don't have enough electrons to give.");
      return;
    }
    const receiverBalance = await db.get(receiverId) || 0;

    await db.set(userId, senderBalance - amount);
    await db.set(receiverId, receiverBalance + amount);

    message.channel.send(`Successfully transferred **${amount}** electrons to ${mentionedUser.username}.`);
}

  // Command to steal; essential part of a capitalistic system
  if (message.content.toLowerCase().startsWith("steal")) {
    const args = message.content.split(" ");
    if (args.length !== 2) {
      message.reply("Usage: steal <@user>");
      return;
    }

    const userId = message.author.id;
    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
      message.reply("Please mention a valid user to steal from.");
      return;
    }
    const initiatorBalance = await db.get(userId) || 0;
    const victimId = mentionedUser.id;
    const victimBalance = await db.get(victimId) || 0;

    if (userId === victimId) {
      message.reply("You can't steal from yourself.");
      return;
    }

    const stealCooldownTime = 15000; // Cooldown time in milliseconds (20 seconds)
    // Check if the user is on cooldown
    if (coolDownMap.has(userId)) {
      const lastSearchTime = coolDownMap.get(userId);
      const currentTime = Date.now();

      if (currentTime - lastSearchTime < stealCooldownTime) {
        const remainingCooldown = (lastSearchTime + stealCooldownTime - currentTime) / 1000;
        message.reply(`Whoa Whoa slow down, please try again in ${remainingCooldown.toFixed(1)}s`);
        return;
      }
    }


    const initiatorRoll = rollDie();
    const victimRoll = rollDie();

    if (initiatorRoll > victimRoll) {
      const percentageStolen = 0.2; // 20% of victim's pocket electrons
      const stolenAmount = Math.floor(victimBalance * percentageStolen);

      await db.set(userId, initiatorBalance + stolenAmount);
      await db.set(victimId, victimBalance - stolenAmount);

      message.channel.send(`You stole **${stolenAmount}** electrons successfully. F in the chat for ${mentionedUser.username}.`);
    }
    else {
      const retributionAmount = Math.floor(initiatorBalance * 0.3);
      await db.set(userId, initiatorBalance - retributionAmount);
      await db.set(victimId, victimBalance + retributionAmount);

      message.channel.send(`You were caught trying to steal from ${mentionedUser.username}. You gave them **${retributionAmount}** electrons.`);
    }

    // Update the last search timestamp for the user
    coolDownMap.set(userId, Date.now());
  }

  // Command to set a user's money to a specific value
  if (message.content.toLowerCase().startsWith("setmoney")) {
    const args = message.content.split(" ");
    if (args.length !== 3) {
      message.reply("Usage: setmoney <@user> <amount>");
      return;
    }

    // Check if the author has permission to use this command (e.g., only admins)
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return;
    }

    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
      message.reply("Please mention a valid user to set money for.");
      return;
    }

    const amount = parseFloat(args[2]);
    if (isNaN(amount) || amount < 0) {
      message.reply("Invalid amount.");
      return;
    }

    const receiverId = mentionedUser.id;
    await db.set(receiverId, amount);

    message.channel.send(`Successfully set ${mentionedUser.username}'s balance to **${amount}** electrons.`);
}

  // Command to show shop
  if(message.content.toLowerCase().startsWith("shop"))
  {
    
  }
});

client.login(process.env.token);