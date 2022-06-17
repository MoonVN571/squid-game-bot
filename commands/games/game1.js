const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus } = require("@discordjs/voice");
const { readdirSync } = require('fs');
const { clean2Array, sleep } = require('../../util');
module.exports = {
    name: "game1",
    description: "Bắt đầu game đầu tiên!",
    aliases: ["g1"],

    async execute(client, message, args) {
        // if(!client.gameReady) return;
        if(client.playCountG1 > 6 || client.g1Finish) return; 
        let audioList = readdirSync('./assets/audio/Game1/');
        
        startGame();

        async function startGame() {
            let getAudio = audioList[Math.floor(Math.random() * audioList.length)];
            let getTImeAudio = getAudio.split("s.mp3")[0] * 1000;

            console.log(getAudio, getTImeAudio);

            client.game1 = true;
            client.playCountG1++;

            const player = createAudioPlayer();
            const resource = createAudioResource('./assets/audio/Game1/' + getAudio);

            message.channel.send("TRÒ CHƠI ĐÃ ĐƯỢC BẮT ĐẦU **" + client.playCountG1 + "/" + 6 + "**");
            
            await sleep(3000);
            await message.channel.send("ARE YOU READY !!!?");
            await sleep(2000);
            await message.channel.send("GO!");
            await sleep(1000);
            await message.channel.send("====================");
            
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.guildId,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            connection.subscribe(player);
            player.play(resource);

            player.on(AudioPlayerStatus.Idle, async () => {
                // LOG DANH DANH SÁCH BỊ LOẠI
                await message.channel.send("====================");
                client.game1 = false;

                if(client.playCountG1 == 2) {
                    await client.userPlaying.get("users").forEach(d => {
                        let countPoint = client.pointG1.filter(data => data == d).length;
                        console.log(countPoint)
                        if(countPoint >= 5) client.userWinnerG1.push(d);
                    });

                    // EXPORT LOSER AFTER 6 TIMES
                    client.g1Finish = true;
                    
                    let loser =  await clean2Array(client.userPlaying.get('users'), client.userWinnerG1);
                    if(!loser || !loser.length) return;

                    client.totalLoser = loser;

                    await message.channel.send("<@" + loser.join(">\n<@") + ">\nChúc mừng Các bạn đã thua cuộc từ vòng gửi xe!");
                } else {
                    startGame();
                }
            });
        }
    }
}