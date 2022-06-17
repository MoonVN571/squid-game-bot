const client = require('../index');

client.on('messageCreate', async message => {
    if(message.author.bot || message.channel.type == "DM") return;

    // CHECK CHANNEL AND CONTINUE
    if(client.playChannel == message.channelId
    && message.content.startsWith("+1")) {
        // client.userWinner.push(message.author.id);
        
        // PUSH USER POINT TO COUNT AND WIN G1
        if(client.game1) client.pointG1.push(message.author.id);
        else {
            // THINK MAYBE REACT LOSER
            if(client.totalLoser.indexOf(message.author.id) < 0)
            {
                client.totalLoser.push(message.author.id);
                console.log("loser", client.totalLoser);
            }
        }
    }
    
    if(!message.content.startsWith(client.prefix)) return;

    const args = message.content.slice(client.prefix.length).split(/ +/);
    const cmdName = args.shift().toLocaleLowerCase();

    const cmd = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if(!cmd) return;

    try {
        cmd.execute(client, message, args);
    } catch(e) {
        console.log(e);
        message.reply({ content: "Lệnh " + cmd.name + " đã sảy ra lỗi, thử lại sau!", allowedMentions: { repliedUser: false} });
    }
})