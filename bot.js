const Discord = require('discord.js');
const prefix = "/";
const botconfig = require("./botconfig.json");
const translate = require('google-translate-api');
const Langs = ['afrikaans','albanian','amharic','arabic','armenian','azerbaijani','bangla','basque','belarusian','bengali','bosnian','bulgarian','burmese','catalan','cebuano','chichewa','chinese simplified','chinese traditional','corsican','croatian','czech','danish','dutch','english','esperanto','estonian','filipino','finnish','french','frisian','galician','georgian','german','greek','gujarati','haitian creole','hausa','hawaiian','hebrew','hindi','hmong','hungarian','icelandic','igbo','indonesian','irish','italian','japanese','javanese','kannada','kazakh','khmer','korean','kurdish (kurmanji)','kyrgyz','lao','latin','latvian','lithuanian','luxembourgish','macedonian','malagasy','malay','malayalam','maltese','maori','marathi','mongolian','myanmar (burmese)','nepali','norwegian','nyanja','pashto','persian','polish','portugese','punjabi','romanian','russian','samoan','scottish gaelic','serbian','sesotho','shona','sindhi','sinhala','slovak','slovenian','somali','spanish','sundanese','swahili','swedish','tajik','tamil','telugu','thai','turkish','ukrainian','urdu','uzbek','vietnamese','welsh','xhosa','yiddish','yoruba','zulu'];
const ms = require("ms");
const randomPuppy = require('random-puppy');
const ytdl = require('ytdl-core');
const weather = require('weather-js');
const { version } = require("discord.js");
const randoms = Math.floor(Math.random() * 2)
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")


const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  bot.user.setActivity(`=help | With ${bot.users.size} Users!` , {type: "PLAYING"});
});
//join/left
bot.on('guildMemberAdd', member => {
      let channel = member.guild.channels.find('name', 'join-left');
      let memberavatar = member.user.avatarURL;
          if (!channel) return;
          let join = new Discord.RichEmbed()
          .setColor('#15f153')
          .setThumbnail(memberavatar)
          .addField(':bust_in_silhouette: | Member Joined!', `${member}`)
          .addField(':microphone2: | Welcome!', `Welcome To The Server, ${member}`)
          .addField(':id: | User :', "**[" + `${member.id}` + "]**")
          .addField(':family_mwgb: | Your Are The Member', `${member.guild.memberCount}`)
          .addField("Name", `<@` + `${member.id}` + `>`, true)
          .addField('Server', `${member.guild.name}`, true )
          .setFooter(`${member.guild.name}`)
          .setTimestamp()

          channel.send(join);
  });
//join-left
  bot.on('guildMemberRemove', member => {
    const goodbyechannel = member.guild.channels.find('name', 'join-left')
      let memberavatar = member.user.avatarURL;
    if (!goodbyechannel) return;
          let left = new Discord.RichEmbed()
          .setColor('#FF0000')
          .setThumbnail(memberavatar)
          .addField('Member Left!', `${member}`)
          .addField('Has Left the Server', 'Hope He/She Come Back Soon!')
          .addField('Bye Bye :(', 'We All Will Miss You!')
          .addField('The Server Now Has', `${member.guild.memberCount}` + " Members")
          .setFooter(`${member.guild.name}`)
          .setTimestamp()

          goodbyechannel.send(left);
  });
//tempmute
bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);


    if(cmd === `${prefix}tempmute`){
      let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!tomute) return message.reply("Couldn't find user.");
      if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
      let muterole = message.guild.roles.find(`name`, "muted");
      if(!muterole){
        try{
          muterole = await message.guild.createRole({
            name: "Muted",
            color: "RANDOM",
            permissions:[]
          })
          message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        }catch(e){
          console.log(e.stack);
        }
      }
      let mutetime = args[1];
      if(!mutetime) return message.reply("You didn't specify a time!");

      await(tomute.addRole(muterole.id));
      message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

      setTimeout(function(){
        tomute.removeRole(muterole.id);
        message.channel.send(`<@${tomute.id}> has been unmuted!`);
      }, ms(mutetime));
    }
  //reaction fire
  if(cmd === `${prefix}fire`){
    message.react('🔥');
  }
  //reaction tada
  if(cmd === `${prefix}tada`){
    message.react('🎉');
  }
  //reaction robot
  if(cmd === `${prefix}robot`){
    message.react('🤖');
  }
  //reaction thinking
  if(cmd === `${prefix}thinking`){
    message.react('🤔');
  }
  //reaction laughing
  if(cmd === `${prefix}laugh`){
    message.react('🤣');
  }
  //lucky number
  if(cmd === `${prefix}luckynumber`){
     let LuckNumber = Math.floor((Math.random() * 12000) + 0.120);
  const numEmb = new Discord.RichEmbed()
  .setColor(0xFFFF00)
  .setAuthor('LUCKY NUMBER', 'https://vignette.wikia.nocookie.net/nintendo/images/0/02/Question_Block_NSMB.png/revision/latest?cb=20151206055532&path-prefix=en')
  .addField('And Your Lucky Number Is..', `**${LuckNumber}**!`);
  message.channel.send({embed: numEmb})

}
  //translate
 if(cmd === `${prefix}translate`){
     if (args[0] === undefined) {

    const embed = new Discord.RichEmbed()
    .setColor("0x22B0FA")
    .setDescription("Provide A Language And Some Text For Me To **Translate.**\nUsage: `/translate <Language> <Text>`");

    return message.channel.send(embed);

  } else {

    if (args[1] === undefined) {

      return message.channel.send('**Please Give Me Something To Translate.** `/translate <Language> <Text>`');

    } else {

      let transArg = args[0].toLowerCase();

      args = args.join(' ').slice(prefix.length);
      let translation;

      if (!Langs.includes(transArg)) return message.channel.send(`Language **Not Found.**`);
      args = args.slice(transArg.length);

      translate(args, {to: transArg}).then(res => {

        const embed = new Discord.RichEmbed()
        .setDescription(res.text)
        .setFooter(`English - ${transArg}`)
        .setColor("0x22B0FA");
        return message.channel.send(embed);

      });

    }

  }

}

  //kick
    if(cmd === `${prefix}kick`){

    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Can't find user!");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You Must Have Permission");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#22B0FA")
    .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Tiime", message.createdAt)
    .addField("Reason", kReason);

    let kickChannel = message.guild.channels.find(`name`, "mod-log");
    if(!kickChannel) return message.channel.send("Can't Find mod log Pls Create A Channel modlog .");

    message.delete().catch(O_o=>{});
    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);

    return message.channel.send(`Member **Kicked Out** Sucessfully!`)
  }
//ban
  if(cmd === `${prefix}ban`){

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Can't find user!");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("You Must Have Permission");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#22B0FA")
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    let incidentchannel = message.guild.channels.find(`name`, "mod-log");
    if(!incidentchannel) return message.channel.send("Can't Find mod log Pls Create A Channel mod log.");

    message.delete().catch(O_o=>{});
    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);


    return message.channel.send(`Member **Banned** Sucessfully!`)
  }
  //report
  if(cmd === `${prefix}report`){

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#22B0FA")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", rreason);

    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.");


    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);

    return message.channel.send(`***Report Send Successfully!***`)
  }
  //serverinfo
     if(cmd === `${prefix}serverinfo`){

      let sicon = message.guild.iconURL;
      let serverembed = new Discord.RichEmbed()
      .setDescription("Server Information")
      .setColor("#22B0FA")
      .setThumbnail(sicon)
      .addField("Server Name", message.guild.name)
      .addField("Created On", message.guild.createdAt)
      .addField("You Joined", message.member.joinedAt)
      .addField('Humans', `**${message.guild.members.filter(member => !member.user.bot).size}**`, true)
      .addField('Bots', `**${message.guild.members.filter(member => member.user.bot).size}**`, true)
      .setFooter(`Owner: ${message.guild.owner.user.tag}`)

      .addField("Total Members", message.guild.memberCount);

      return message.channel.send(serverembed);
    }

  //botinfo
    if(cmd === `${prefix}botinfo`){

      let bicon = bot.user.displayAvatarURL;
      let botembed = new Discord.RichEmbed()
      .setDescription("Bot Information")
      .setColor("#22B0FA")
      .setThumbnail(bicon)
      .addField("Bot Name", bot.user.username)
      .addField("Created On", bot.user.createdAt)
      .addField("Guild Bot On", bot.guilds.size)
      .addField("Playing Users", bot.users.size)

      return message.channel.send(botembed);
    }
  //help command
    if(cmd === `${prefix}help`){
	    
	    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
        .setThumbnail(bicon)
        .addField("Default Prefix", '`/`')
        .addField("General Commands", `**Help :** Shows Up The Help Command!\n*Usage : <prefix>help*\n\n**Say :** It Will Say AnyThing You Want!\n*Usage : <prefix>say <what you want to say>*\n\n**Avatar :** It Will Show Your Avatar!\n*Usage : <prefix>avatar*\n\n**Coin Flip :** Flips A Coin!\n*Usage : <prefix>coinflip*\n\n**Server Invite Generator :** Generates Invite Link Of The Server!\n*Usage : <prefix>createinvite*`)
        .addBlankField()
        .addField("Moderation Commands", `**Kick :** It Will __Kick__ Any User As Long The Bot Has A Higher Role!\n*Usage : <prefix>kick <user> <reason>*\n\n**Ban :** It Will __Ban__ Any User As Long The Bot Has A Higher Role!\n*Usage : <prefix>ban <user> <reason>*\n\n**Warn :** Warn's A User From The Server!\n*Usage : <prefix>warn <user> <reason>*\n\n**Tempmute :** It Will __Mute__ An User For An Time You Provide!\n*Usage : <prefix>tempmute <user> <time>*\n\n**Add Role :** Adds A Role To A User!\n*Usage : <prefix>addrole <user> <rolename>*\n\n**Remove Role :** Removes A Role From A User!\n*Usage : <prefix>removerole <user> <rolename>*\n\n**Purge :** It Will Clear Up 100 Messages No Older Than 14 Days!\n*Usage : <prefix>purge <amount of messages>*\n\n**Channel Lockdown :** Locks A Channel For A Time You Provide!\n*Usage : <prefix>lockdown <time>*\n\n**Set Prefix :** Make The Bot Have Any Prefix You Desire!\n*Usage : <prefix>setprefix <whatever you want>*`)
        .addBlankField()
        .addField("Server Commands", `**Server Info :** It Wil Show The Server's Information!\n*Usage :<prefix>serverinfo*\n\n**Bot Info :**  It Will Show You The Bot's Information!\n*Usage : <prefix>botinfo*`)
        .addBlankField()
        .addField("NSFW Commands", `**NSFW Nudes :** It Will Show NSFW Related Pictures!\n*Usage : <prefix>nudes*\n\n**NSFW GIF's :** It Will Show NSFW Related GIF's!\n*Usage : <prefix>nudesgif*`)
        .setFooter(`Requested by : ${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL)
        .setTimestamp()
        .setColor('#20A4FF');

      return message.channel.send(`<@${message.author.id}>, 📭 Please Check Your **DM's**!`, message.author.send(botembed));
      }
  //membercount
  if(cmd === `${prefix}membercount`){

    let icon = message.guild.iconURL;
	const embed = new Discord.RichEmbed()
		.setAuthor(message.guild.name)
		.setColor('#22B0FA')
		.setThumbnail(icon)
		.addField('Members', `**${message.guild.memberCount}**`, true)
    .addBlankField(true)
		.addField('Humans', `**${message.guild.members.filter(member => !member.user.bot).size}**`, true)
		.addField('Bots', `**${message.guild.members.filter(member => member.user.bot).size}**`, true)
		.addField('Member Status', `**${message.guild.members.filter(o => o.presence.status === 'online').size}** Online\n**${message.guild.members.filter(i => i.presence.status === 'idle').size}** Idle/Away\n**${message.guild.members.filter(dnd => dnd.presence.status === 'dnd').size}** Do Not Disturb\n**${message.guild.members.filter(off => off.presence.status === 'offline').size}** Offline/Invisible\n**${message.guild.members.filter(s => s.presence.status === 'streaming').size}** Streaming`)
		.setFooter(`Owner: ${message.guild.owner.user.tag}`)
	message.channel.send(embed);
};
  //userinfo
    if(cmd === `${prefix}userinfo`){

       let userembed = new Discord.RichEmbed()
       .setDescription('User Info')
       .setColor('03FF44')
       .setImage(message.author.avatarURL)
       .setTimestamp()

       return message.channel.send(userembed);
}
  //support
  if(cmd === `${prefix}support`){

    let supportembed = new Discord.RichEmbed()
    .setTitle('I See, You Need Some More Help?')
    .setDescription('This Is Croby! So, You Can Join Our Support Server To Get Some More Help! Follow The Link Below!')
    .setColor('#22B0FA')
    .addField("Support Server", 'https://discord.gg/TJceEMG')
    .setTimestamp()

    return message.channel.send(supportembed);
  }
  //invite
  if(cmd === `${prefix}invite`){

    let inviteembed = new Discord.RichEmbed()
    .setTitle('Invite Me In Your Server?')
    .setDescription('This Is Croby! Wanna Invite Me In Your Server? Follow The Link Below!')
    .setColor('#22B0FA')
    .addField("Invite", 'https://bit.ly/InviteBatteryBot')
    .setTimestamp()

    return message.channel.send(inviteembed);
  }
  //say
  if(cmd === `${prefix}say`){
    message.delete();
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return (message, "MANAGE_MESSAGES");
    let botmessage = args.join(" ");
    message.channel.send(botmessage);
  }
  //serverinvites leaderboard
  if(cmd === `${prefix}serverinvites`){
   let invites = await message.guild.fetchInvites().catch(error => {
        return message.channel.send('Sorry, I don\'t have the proper permissions to view invites!');
    });

    invites = invites.array();

    let possibleinvites = [];
    invites.forEach(function(invites) {
        possibleinvites.push(`${invites.inviter.username} ||  ${invites.uses}`)
    })

    const embed = new Discord.RichEmbed()
        .setTitle(`INVITE LEADERBOARD`)
        .setColor(0xCB5A5E)
        .addField('Invites', `\`\`\`${possibleinvites.join('\n')}\`\`\``)
        .setTimestamp();
    message.channel.send(embed);
}
  //guildinvite creator
  if(cmd === `${prefix}createinvite`){
      if (!message.member.hasPermission("CREATE_INSTANT_INVITE")) return;
  message.channel.createInvite({maxAge: 0}).then(invite => {
    let embed = new Discord.RichEmbed()
    .setColor(0xCB5A5E)
    .setDescription(`**Permanent Invite Link**: ${invite}`);
    message.channel.send(embed);
  });
}
  //warn
  if(cmd === `${prefix}warn`) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, but you don't have permission to use this!")
   let warnedmember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!warnedmember) return ("Please mention a user to warn.");
     let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";


      message.delete().catch(O_o=>{});
    message.channel.send(`***${warnedmember.user.tag} was warned!***`)
   await warnedmember.send(`You have been warned in ${message.guild.name} by ${message.author.username} for: ${reason}.`)

  }
  //google search
  if(cmd === `${prefix}google`){
    let google = args.slice(0).join('+');
    let link = `https://www.google.com/search?q=` + google;
	message.channel.send(link);
}
//yt search
if(cmd === `${prefix}youtube`){
    let youtube = args.slice(0).join('+');
    let link = `https://www.youtube.com/results?search_query=` + youtube;
	message.channel.send(link);
}
  //coinflip
  if(cmd === `${prefix}coinflip`){
      message.channel.send(`Result: **${Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails"}**!`);
}
  //nsfw
  if (cmd === `${prefix}nudes`) {
    if (!message.channel.nsfw) return message.reply("You can use this command only on nsfw channels!");

    var subreddits = [
        'NSFW_Wallpapers',
        'SexyWallpapers',
        'HighResNSFW',
        'nsfw_hd',
        'UHDnsfw',
        'Anal',
        'Porn'
    ]
    var sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))];

    randomPuppy(sub)
        .then(url => {
            const embed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setAuthor("4k", bot.user.avatarURL)
                .setFooter("xD")
                .setImage(url);
            message.channel.send({
                embed
            });
        })
}
  //ping
  if(cmd === `${prefix}ping`){
    let start = Date.now(); message.channel.send(message.channel.id, 'Pong! ').then(message => {
      let diff = (Date.now() - start);
      let API = (bot.ping).toFixed(2)

      let pingg = new Discord.RichEmbed()
      .setTitle(`🔔 Pong!`)
      .setColor(0x22B0FA)
      .addField("📶 Latency", `${diff}ms`, true)
      .addField("💻 API", `${API}ms`, true)
      message.edit(pingg);

    });

}

exports.help = {
    name: 'ping',
    category: 'INFO'
}
  //wwe gif
  if(cmd === `${prefix}wwegif`){
    let replies = ["https://media.giphy.com/media/HbkT5F5CiRD3O/giphy.gif", "https://media.giphy.com/media/10sDMjEoL7cAOA/giphy.gif", "https://media.giphy.com/media/xT39D7ubkIUIrgX7JS/giphy.gif", "https://media.giphy.com/media/kRWFIgO75okHm/giphy.gif", "https://media.giphy.com/media/TlK63Er4gKHILXzNeA8/giphy.gif", "https://media.giphy.com/media/14smAwp2uHM3Di/giphy.gif", "https://media.giphy.com/media/VPtakcmZS6z5K/giphy.gif", "https://media.giphy.com/media/gdKAVlnm3bmKI/giphy.gif", "https://media.giphy.com/media/VgIums4vgV4iY/giphy.gif", "https://media.giphy.com/media/l4EoX23aHCEIVlcTm/giphy.gif", "https://media.giphy.com/media/xT39CTnUseDauWbrRS/giphy.gif", "https://media.giphy.com/media/roAfEu8tdNYe4/giphy.gif", "https://media.giphy.com/media/l4Ep6mu0EsZlneBs4/giphy.gif", "https://media.giphy.com/media/g9x6SOnpJ7Mxa/giphy.gif", "https://media.giphy.com/media/RptlNBj3wJMbu/giphy.gif"];

    let result = Math.floor((Math.random() * replies.length));

    let gifembed = new Discord.RichEmbed()
        .setTitle("WWE GIF")
        .setColor("#FF69B4")
        .setFooter(`Gif ${message.author.tag} `, message.author.avatarURL)
        .setImage(replies[result]);

    message.channel.send(gifembed);
}
  //nsfwgif
  if(cmd === `${prefix}nudesgif`){

    if (!message.channel.nsfw) return message.reply("You can use this command only on nsfw channels!");

    let replies = ["https://78.media.tumblr.com/8c3df486bc2f7eb0b992019ff74c812a/tumblr_osn7f1242h1vpw5nxo1_500.gif", "https://78.media.tumblr.com/2ed7f5b5b1886a73b472d0e9f52f8b70/tumblr_o7854tvKXR1vpw5nxo1_400.gif", "https://78.media.tumblr.com/b9abb328981dc634da641b9b0f68cc40/tumblr_o4xkg71BGk1vpw5nxo1_500.gif", "https://78.media.tumblr.com/fd8e86ba904b17170f11d731e99043c2/tumblr_o4ry8qckvG1vpw5nxo1_500.gif", "https://78.media.tumblr.com/40c78b68c8ed362513d3286bf99f322f/tumblr_o4n22jlwJN1vpw5nxo1_400.gif", "https://78.media.tumblr.com/4f50555ee26b8cda1868108c57e8f2e5/tumblr_o4mmiqF2Cz1vpw5nxo1_400.gif", "https://78.media.tumblr.com/eb9a74715e65870b78535e941306307f/tumblr_o4l4ppRqat1vpw5nxo1_250.gif", "https://78.media.tumblr.com/544d5b52e112d86dc8494356118f0d15/tumblr_p9ei8wIJuf1v7dt6vo1_500.gif", "https://78.media.tumblr.com/cd7a4c688c8f5d7b05d8c092951180d1/tumblr_p91b9e2Kfh1v7dt6vo1_500.gif",
        "https://78.media.tumblr.com/5710bafd5111f8ffa3e1d631d689f12a/tumblr_p91toahaH91v7dt6vo1_400.gif"
    ];

    let result = Math.floor((Math.random() * replies.length));

    let gifembed = new Discord.RichEmbed()
        .setTitle("Here's your GIF! ")
        .setColor("#FF69B4")
        .setFooter(`Requested by ${message.author.tag} `, message.author.avatarURL)
        .setImage(replies[result]);

    message.channel.send(gifembed);
  }

  //purgemessage
  if(cmd === `${prefix}purge`){
    if (isNaN(args[0])) return message.channel.send('Please Supply A **Valid Amount Of Messages To Purge!**');

 if (args[0] > 100) return message.channel.send('Please Supply A Number **Less Than 100**');

 message.channel.bulkDelete(args[0])
   .then(messages => message.channel.send(`**Successfully Deleted \`${messages.size}/${args[0]}\` Messages!**`).then(msg => msg.delete({
     timeout: 10000
   })))

}
//weather
  if(cmd === `${prefix}weather`){
   weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
      if (err) message.channel.send(err);
      if (result === undefined || result.length === 0) {
          message.channel.send('**Please Enter A Location!**')
          return;
      }
      var current = result[0].current;
      var location = result[0].location;
      const embed = new Discord.RichEmbed()
          .setDescription(`**${current.skytext}**`)
          .setAuthor(`Weather for ${current.observationpoint}`)
          .setThumbnail(current.imageUrl)
          .setColor(0x00AE86)
          .addField('Timezone',`UTC${location.timezone}`, true)
          .addField('Degree Type',location.degreetype, true)
          .addField('Temperature',`${current.temperature} Degrees`, true)
          .addField('Feels Like', `${current.feelslike} Degrees`, true)
          .addField('Winds',current.winddisplay, true)
          .addField('Humidity', `${current.humidity}%`, true)
          message.channel.send({embed});
  })
  }
  //stats
  if(cmd === `${prefix}stats`){

 let cpuLol;
  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }


  const gif = 'https://cdn.discordapp.com/attachments/449551100153167875/474951099699298317/loader.gif'
  const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  const embedStats = new Discord.RichEmbed()
    .setAuthor(bot.user.username,gif)
    .setTitle("Stats")
    .setColor("#22B0FA")
    .addField("• Mem Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
    .addField("• Uptime ", `${duration}`, true)
    .addField("• Users", `${bot.users.size.toLocaleString()}`, true)
    .addField("• Servers", `${bot.guilds.size.toLocaleString()}`, true)
    .addField("• Channels ", `${bot.channels.size.toLocaleString()}`, true)
    .addField("• Discord.js", `v${version}`, true)
    .addField("• Node", `${process.version}`, true)
    .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
    .addField("• CPU usage", `\`${percent.toFixed(2)}%\``,true)
    .addField("• Arch", `\`${os.arch()}\``,true)
    .addField("• Platform", `\`\`${os.platform()}\`\``,true)
    message.channel.send(embedStats)
  })
};
  //uptime
  if(cmd === `${prefix}uptime`){
  var milliseconds = parseInt((bot.uptime % 1000) / 100),
        seconds = parseInt((bot.uptime / 1000) % 60),
        minutes = parseInt((bot.uptime / (1000 * 60)) % 60),
        hours = parseInt((bot.uptime / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        message.channel.send(":chart_with_upwards_trend: I've been running for** " + hours + " **hours, **" + minutes + "** minutes and **" + seconds + "." + milliseconds + "** seconds!");
}
});
bot.login(process.env.TOKEN);
