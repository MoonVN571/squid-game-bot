const { clean2Array } = require("../../util");
const { Client, Message } = require('discord.js');
module.exports = {
    name: "game2",
    aliases: ['g2'],
    
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        // CHECK Game 1 END BEFORE NEXT G 2

        // PLAY G2
        message.channel.send("GAME 2 ĐÃ ĐƯỢC BẮT ĐẦU!");

        let users = await clean2Array(client.userPlaying.get('users'), client.totalLoser);
        
        users.forEach(userId => {
            message.guild.members.cache.get(userId)
            .send("Câu hỏi là gì ?")
            .then(msg => {
                const filter = (m) => m.author.id === userId;
                const collector = msg.channel.createMessageCollector({
                    filter,
                    time: 5_000,
                    dispose: true
                });

                let datraloi = false;
                collector.on('collect', message => {
                    console.log(message.content)
                    message.channel.send("Đã ghi nhận trả lời của bạn!");
                    datraloi = true;

                    client.userAnswered.push({ userId: userId, answer: message.content });
                });
                
                collector.on('dispose', message => {
                    if(!datraloi) {
                        message.channel.send("Đã hết thời gian trả lời!");
                        client.userNotAnswered.push(userId);
                    }
                });
            });
        });

        setTimeout(async() => {
            message.channel.send("Đã hết thời gian trả lời câu hỏi!");
            message.channel.send("Đang tiến hành hiển thị đáp án từng người.");

            let show = [];

            await client.userAnswered.forEach(d => {
                let user = message.guild.members.cache.get(d.userId).user.toString();
                show.push("**" + user + "** | " + d.answer);
            });

            let loser = [];

            await client.userNotAnswered?.forEach(d => {
                let user = message.guild.members.cache.get(d.userId).user.toString();
                loser.push(user + ",\n");

            });

            await message.channel.send(`
Đáp án Người chơi
${show.join("\n")}

Không trả lời (Loại)
${loser.length ? loser : "Không có"}

            `);

        }, 5000);
    }
}