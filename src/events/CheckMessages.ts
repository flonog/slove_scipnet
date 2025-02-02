import { Client, EmbedBuilder, Message, Poll, TextChannel } from "discord.js";
import { IEvent } from "../class/events/Event";
import * as config from "../config.json"
import { PersoRP } from "../class/PersoRP";
import { LockChannels } from "./LockChannels";
import { ChannelRP } from "../class/ChannelRP";

export class CheckMessages implements IEvent {
	action: string = "messageCreate";
	name: string;
	async OnEventFired(client: Client<boolean>, message : Message): Promise<void> {
		ChannelRP.GetChannelRP(message.channel.id).then(async (_) => {
			if(message.author.bot)	return;
			
			if(message.author.id === client.user.id) return;

			let perso = await PersoRP.GetPersoRP(message.channelId, message.member.id);

			let channel = <TextChannel> message.channel;

			if(!perso){
				channel.send(`Erreur : Utilisateur inconnu. Merci de vous enregistrer. \n||<@${message.author.id}>||`).then((newmsg) => {
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

			channel.send({embeds : [embed]}).catch(console.log);

			if(files.length > 0) channel.send({files : files}).catch(console.log);
			
			if(message.poll != null){
				let poll : any = message.poll;
				poll.duration = 24;
				channel.send({poll : poll});
			}
		}).catch((err) => {
			console.log(err);
		})

		message.delete();
	}
	
}