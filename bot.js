const Discord = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');

const client = new Client();
client.login(process.env.CLIENT_LOGIN);

let isBotReady = false;
var subreddit_address = `https://www.reddit.com/r/${process.env.SUBREDDIT_ADDRESS}/new.json?limit=5`;
var subreddit_about = `https://www.reddit.com/r/${process.env.SUBREDDIT_ADDRESS}/about.json`;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'with Ebola Genome',
            type: 'PLAYING',
        },
    });
    isBotReady = true;
});

client.on('error', (error) => {
    console.log(`Connection error, ${error}`);
    isBotReady = false;
});

const command = '<y>';
client.on('message', async message => {
    if (message.content === `${command}ping`) {
        message.channel.send('pong');
    }
    if (message.content === `${command}what is my username`) {
        message.reply(message.author.username);
    }
    if (message.content === `${command}what is my avatar`) {
        message.reply(message.author.displayAvatarURL())
    }
    if (message.content === `${command}rip`) {
        const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
        message.channel.send(attachment);
    }
    if (message.content === `${command}how to embed`) {
        const embed = new MessageEmbed()
          .setTitle('A slick little embed')
          .setColor(0xff0000)
          .setDescription('Hello, this is a slick embed!');
        message.channel.send(embed);
    }

    if (message.content === `${command}cat`) {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        message.channel.send(file);
    }

    console.log(`${message.author.username} sent a message ${message.content}!`);
});

var count = 0;
let subredditData;

setInterval(() => {
    if (isBotReady == true) {
        console.log(`is the bot ready = ${isBotReady}`);
        getSubredditAbout(subreddit_about);
        
        if (subredditData != undefined) {
            fetchSubreddit(subreddit_address);
        }
        count++;
    }

}, 20 * 1000);

let lastTimestamp = Math.floor(Date.now() / 1000);

const getSubredditAbout = async(uri) => {
    subredditData =  await fetch(uri).then(res => res.json()).catch(error => console.error(error));
}


async function fetchSubreddit(uri) {
    const { data } = await fetch(uri).then(res => res.json()).catch(error => console.error(error));
    var embed = new MessageEmbed();
    console.log(`Request succeeded, lastTimestamp = ${lastTimestamp}`);
    data.children.reverse();

    for (let i=0; i< data.children.length; i++) {
        var feed = data.children[i].data;
        lastTimestamp = data.children[data.children.length-1].data.created_utc;
        embed = new MessageEmbed();

        if (lastTimestamp < feed.created_utc) {
            if (feed.stickied != true) {
                embed.setAuthor(feed.subreddit_name_prefixed, subredditData.icon_img, `https://reddit.com${subredditData.url}`);
                embed.setColor('#007cbf');
                embed.setTitle(feed.title == "" ? feed.subreddit : feed.title);
                embed.setURL(`https://redd.it/${feed.id}`);
                embed.addField(`\u200B`, `[Comments](https://reddit.com${feed.permalink})`);
                embed.setDescription(feed.selftext);
                embed.setImage(feed.url);
                embed.setFooter(`Posted by ${feed.author}`);
                embed.setTimestamp(new Date(feed.created_utc * 1000));
                client.channels.cache.get(process.env.CHANNEL_ID).send(embed);  
            }
        }
    }

    // let channel = client.channels.cache.get(process.env.CHANNEL_ID);
    // channel.messages.fetch({ limit: 1 }).then(messages => {
    //     //var lastTimestamp = Math.floor(messages.first() / 1000);
    //     console.log(messages.first());
    // }).catch(console.error);

}

