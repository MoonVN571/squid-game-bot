const { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { Client, Message, MessageActionRow, MessageButton, Interaction } = require('discord.js');
const ms = require('ms');
module.exports = {
    name : "start",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        
        if(!args[0])
            return message.reply({content: "Cung cấp thời gian kết thúc tham gia!"});
        
        //
        let times = ms(args[0]);
        if(!times || args[0] > 10 * 60 * 1000) // Giới hạn 10 phút
            return message.reply({content: "Thời gian không hợp lệ thử lại sau!"});
        
        let joinButt = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(message.channelId + "tham-gia")
                    .setStyle("PRIMARY")
                    .setLabel("PLAY!")
            );

        let users = client.userPlaying;
    

        message.channel.send({
            embeds: [createMainEmbed()],
            components: [joinButt]
        }).then(msg => createGame(msg))
        /**
         * @param {Message} msg
         */
        function createGame(msg) {
            let collector = msg.createMessageComponentCollector({
                time: times
            });

            collector.on('collect', async interaction =>{
                if(!checkArray('users', interaction.user.id, users)){
                    await interaction.reply({
                        content: "Tham gia thành công!",
                        ephemeral: true
                    });
                    
                    await arrayAdd('users', interaction.user.id, users);
                    
                    msg.edit({ embeds: [createMainEmbed()], components: [joinButt]});
                } else {
                    await interaction.deferUpdate().catch(()=>{});
                }
            });

            collector.on('end', async interaction => {
                joinButt = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(message.channelId + "tham-gia")
                            .setStyle("PRIMARY")
                            .setLabel("PLAY!")
                            .setDisabled(true)
                    );

                msg.edit({ components: [joinButt]});

                startPlay(msg, interaction);
            });
        }

        function createMainEmbed() {
            let userCount = users.get('users') || 0;
            
            return {
                title: "SQUID-GAME",
                description: "Tham gia trò chơi!",
                fields: [
                    {
                        name: "Người đã tham gia",
                        value: (userCount.length ? userCount.length : 0) + " players"
                    }
                ],
                footer: "Không chơi không bấm (bấm không chơi = ban)",
                timestamp: new Date(),
                color: "YELLOW"
            };
        }

        /**
         * 
         * @param {Message} msg 
         * @param {Interaction} interaction 
         */
        async function startPlay(msg, interaction) {
            // PLAY SOUND CHỜ GAME BẮT ĐẦU!
            const soundBatDau = createAudioResource('./assets/audio/background.mp3');
            const player = createAudioPlayer();

            const connection = joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.guildId,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            connection.subscribe(player);
            // player.play(soundBatDau);
            
            // SET NICK BOT TO TOP
            message.guild.me.setNickname('! ' + client.user.username);

            player.on(AudioPlayerStatus.Idle, () => {
                
            });

            client.gameReady = true;

            // SET CHANNEL
            client.playChannel = message.channelId;
        }
        
        /**
         * @param {any} name
         * @param {any} data 
         * @param {Map} type 
         */
        async function arrayAdd(name, data, type) {
            let arrayData = type.get(name) || [];
            await arrayData.push(data);
            console.log(type, data)
            type.set(name, arrayData);
        }
        
        /**
         * @param {any} name
         * @param {any} data 
         * @param {Map} type 
         */
        function checkArray(name, data, type) {
            let checks = type.get(name) || [];
            if(checks.indexOf(data) > -1) return true;
            else return false;
        }
        
    }
}