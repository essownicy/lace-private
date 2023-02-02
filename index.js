require("dotenv").config();
const {
	Client,
	MessageEmbed,
	WebhookClient,
	Permissions,
} = require("discord.js");

const client = new Client({
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
	intents: [
		"DIRECT_MESSAGES",
		"DIRECT_MESSAGE_REACTIONS",
		"GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS",
		"GUILDS",
	],
	allowedMentions: { repliedUser: false },
});
const { prefix } = require("./config.json");

client.on("ready", () => {
	console.log(`${client.user.tag} is ready ✅`);

	client.user.setPresence({
		status: "idle",
	});

	const hook = new WebhookClient({
		url: "https://canary.discord.com/api/webhooks/1070648574272094228/MwMJY6H3z7noOM7t0TJkNl_ahOdD3puD-fudSuu9agmcGWTv7bVC-9EIc-UXe9eQ5Zp5",
	});

	hook.send(`${client.user.tag} is ready ✅`);
});

client.on("messageCreate", message => {
	if (!message.content.startsWith(prefix)) return;
	if (message.author.bot) return;
	// if (message.guild.id != "875384791334285342") return;

	if (!message.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS))
		return message.channel.send(`you ain't admin, are you?`);

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === "help") {
		const help_embed = new MessageEmbed()
			.setColor("#2F3136")
			.setDescription(
				`prefix: \`+\` \n\ncmds list: \`ban/unban\`, \`kick\`, \`ping\`, \`say\`, \`jail/unjail\``
			);

		message.reply({ embeds: [help_embed] });
	}

	if (command === "ban") {
		const target = message.mentions.members.first();

		if (!target)
			return message.channel.send(
				`u need to mention an idiot which u want to ban`
			);

		try {
			target.ban();
			message.channel.send(`👍`);
		} catch (error) {
			message.channel.send(`\`\`\`${error.stack}\`\`\``);
			console.log(error);
		}
	}

	if (command === "unban") {
		const membertounban = args[0];

		if (!args[0])
			return message.reply(
				"i need discord-uid of member which u want to unban"
			);

		try {
			message.guild.bans.remove(membertounban);
		} catch (erorr) {
			message.channel.send(`\`\`\`${error.stack}\`\`\``);
		}

		message.channel.send("👍");
	}

	if (command === "kick") {
		const target = message.mentions.members.first();

		if (!target)
			return message.channel.send(
				`u need to mention an idiot which u want to kick`
			);

		try {
			target.kick();
			message.channel.send(`👍`);
		} catch (error) {
			message.channel.send(`\`\`\`${error.stack}\`\`\``);
			console.log(error);
		}
	}

	if (command === "ping") {
		const ping_embed = new MessageEmbed()
			.setColor("#2F3136")
			.setDescription(`websocket: \`${client.ws.ping}\ms`);

		message.reply({ embeds: [ping_embed] });
	}

	if (command === "say") {
		const sayMessageChannel = message.mentions.channels.first();
		const sayMessage = args.slice(1).join(" ");

		if (!sayMessage) return message.channel.send(`give some text dumbass`);
		if (!sayMessageChannel)
			return message.channel.send(
				`ping channel bc i dont know where i have to send message`
			);

		message.delete();
		sayMessageChannel.send(`${sayMessage}`);
	}

	if (command === "jail") {
		const member = message.mentions.members.first();

		try {
			let role = message.member.guild.roles.cache.find(
				role => role.name === "Gulag"
			);
			if (role) message.guild.members.cache.get(member.id).roles.add(role);

			message.reply("👍");
		} catch (error) {
			message.channel.send(`\`\`\`${error.stack}\`\`\``);
			console.log(error);
		}
	}

	if (command === "unjail") {
		const member = message.mentions.members.first();

		try {
			let role = message.member.guild.roles.cache.find(
				role => role.name === "Gulag"
			);
			if (!member.roles.cache.has("971772998212272168"))
				return message.reply("he aint jailed");

			if (role) message.guild.members.cache.get(member.id).roles.remove(role);

			message.reply("👍");
		} catch (error) {
			message.channel.send(`\`\`\`${error.stack}\`\`\``);
			console.log(error);
		}
	}
});

client.login(process.env.TOKEN);
