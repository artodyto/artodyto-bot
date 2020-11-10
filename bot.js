const Discord = require('discord.js');
require('dotenv').config();
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');

const client = new Client();
console.log(process.env);
client.login(process.env.CLIENT_LOGIN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'with Ebola Genome',
            type: 'PLAYING',
        },
        
    });
});


client.on('message', message => {
    if (message.content === '!ping') {
        message.channel.send('pong');
    }
    if (message.content === "!what is my user name") {
        message.reply(message.author.username);
    }
    if (message.content === '!what is my avatar') {
        message.reply(message.author.displayAvatarURL())
    }
    if (message.content === '!rip') {
        const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
        message.channel.send(attachment);
    }
    if (message.content === '!how to embed') {
        // We can create embeds using the MessageEmbed constructor
        // Read more about all that you can do with the constructor
        // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
        const embed = new MessageEmbed()
          // Set the title of the field
          .setTitle('A slick little embed')
          // Set the color of the embed
          .setColor(0xff0000)
          // Set the main content of the embed
          .setDescription('Hello, this is a slick embed!');
        // Send the embed to the same channel as the message
        message.channel.send(embed);
    }

});
