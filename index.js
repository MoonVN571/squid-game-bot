const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: ['MESSAGE', 'USER', 'CHANNEL']
});

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();

require('./handlers/baseHandler');

const prefix = "!";
client.prefix = prefix;

// GAME PLAY DATA
client.userPlaying = new Collection();
client.gameReady = false;
client.playChannel = undefined;
client.totalLoser =  [];

// GAME 1
client.game1 = false;
client.g1Finish = false;
client.playCountG1 = 0;
client.pointG1 = [];
client.userWinnerG1 = [];

// GAME 2
client.userAnswered = [];
client.userNotAnswered = [];
client.userWinnerG2 = [];

require('dotenv').config();
client.login(process.env.TOKEN, err => console.log(err));
