import { AttachmentBuilder, Client, Interaction, Message, MessageFlags, PermissionsBitField } from "discord.js";
import { IEvent } from "../class/events/Event";
import * as config from "../config.json";
import * as fs from "fs";
import { DiscordClient } from "../class/DiscordClient";
export class RegisterChannel implements IEvent {

	action: string = "interactionCreate";
	name: string = "Register Channel Intents";

	OnEventFired(client: Client<boolean>, interaction : Interaction): void {
		if(!interaction.isChatInputCommand()) return;

		if(interaction.commandName !== 'register_channel') return;

		if(config.channels.includes(interaction.channelId)){
			interaction.reply({
				ephemeral : true,
				content : "Ce channel est déjà enregistrer comme Channel RP",
			}).catch(err => {
				console.log(err);
			});
			return;
		}
			

		if(!(interaction.memberPermissions.any("Administrator", true) || config.admin_bot.includes(interaction.user.id))){
			interaction.reply({
				ephemeral : true,
				content : "Vous n'avez pas l'autorisation d'effectuer cette commande.",
			}).catch(err => {
				console.log(err);
			});

			return;
		}
		
		config.channels.push(interaction.channelId);

		fs.writeFileSync(__dirname + "/../config.json", JSON.stringify(config, (key, value) => {
			return key === "default" ? void(0) : value;
		}), {encoding:'utf8',flag:'w'});
		

		interaction.reply({
			ephemeral : true,
			content : "Succès",
		}).catch(err => {
			console.log(err);
		});
	}
}