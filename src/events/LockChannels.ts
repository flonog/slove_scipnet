import { ActivityType, AttachmentBuilder, ChannelType, Client, EmbedBuilder, GuildMemberRoleManager, Interaction, Message, MessageFlags, PermissionsBitField } from "discord.js";
import { IEvent } from "../class/events/Event";
import * as config from "../config.json";
import * as fs from "fs";
import { DiscordClient } from "../class/DiscordClient";
import { CONSTRAINT } from "sqlite3";
export class LockChannels implements IEvent {

	action: string = "interactionCreate";
	name: string = "Register Channel Intents";

	public static isLock = false;

	OnEventFired(client: Client<boolean>, interaction : Interaction): void {
		if(!interaction.isChatInputCommand()) return;

		if(interaction.commandName !== 'lock') return;

		let roleCache = (interaction.member.roles instanceof GuildMemberRoleManager ? interaction.member.roles.cache : null);

		if(!(interaction.memberPermissions.any("Administrator", true) || config.admin_bot.includes(interaction.user.id))){
			interaction.reply({
				ephemeral : true,
				content : "Vous n'avez pas l'autorisation d'effectuer cette commande.",
			}).catch(err => {
				console.log(err);
			});
			return;
		}

		LockChannels.isLock = !LockChannels.isLock;

		let embed = new EmbedBuilder()
		.setTitle("**Message Système**")
		.setDescription(LockChannels.isLock ? "🔒 La MISS est verrouillée. Toute tentative d'envoie de messages sera annulée." : "🔓 La MISS est à présente déverrouillée.")
		.setColor(LockChannels.isLock ? "Red" : "DarkGreen");

		client.user.setPresence({
			activities : [{
				name : LockChannels.isLock ? "Système verrouillé" : "",
				type : ActivityType.Custom
			}],
			status : LockChannels.isLock ? 'dnd' : 'online'
		})

		client.user.setStatus(LockChannels.isLock ? 'dnd' : 'online');

		config.channels.forEach(val => {
			let channel = client.channels.cache.get(val);
			if(!(channel.type === ChannelType.GuildText))
				return;

			channel.send({embeds : [embed]}).catch(console.log);
		})

		interaction.reply({
			ephemeral : true,
			content : "Succès",
		}).catch(err => {
			console.log(err);
		});
	}
}