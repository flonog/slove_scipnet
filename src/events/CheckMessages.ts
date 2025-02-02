import { Client, EmbedBuilder, Message } from "discord.js";
import { IEvent } from "../class/events/Event";
import * as config from "../config.json"
import { PersoRP } from "../class/PersoRP";
import { LockChannels } from "./LockChannels";

export class CheckMessages implements IEvent {
	action: string = "messageCreate";
	name: string;
	async OnEventFired(client: Client<boolean>, message : Message): Promise<void> {
		if(!config.channels.includes(message.channelId)) return;
		if(message.author.bot)	return;
		
		if(message.author.id === client.user.id) return;

		let perso = await PersoRP.GetPersoRP(message.channelId, message.member.id);

		if(!perso){
			message.channel.send(`Erreur : Utilisateur inconnu. Merci de vous enregistrer. \n||<@${message.author.id}>||`).then((newmsg) => {
				setTimeout(() => {
					newmsg.delete().catch((err) => {});
				}, 5000)
			}).catch((err) => console.error(err));
			message.delete();
			return;
		}

		if(LockChannels.isLock){
			message.delete();
			return;
		}

		let embed = new EmbedBuilder()
		.setColor("Blurple")
		.setTitle(perso.getName())
		.setDescription(message.content.length > 0 ? message.content : 'Sans message')
		.setAuthor({
			name: message.author.displayName + ` (${message.author.username + '#' + message.author.discriminator})`,
			iconURL: message.author.avatarURL()
		})
		.setTimestamp();

		let files = [];
		if(message.attachments.size > 0){
			message.attachments.each((value) => {
				
				files.push(value)
			})
		}

		message.channel.send({embeds : [embed]}).catch(console.log);

		if(files.length > 0) message.channel.send({files : files}).catch(console.log);

		message.delete();
	}
	
}