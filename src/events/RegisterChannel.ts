import { AttachmentBuilder, Client, Interaction, Message, MessageFlags, PermissionsBitField } from "discord.js";
import { IEvent } from "../class/events/Event";
import * as config from "../config.json";
import * as fs from "fs";
import { DiscordClient } from "../class/DiscordClient";
import { ChannelRP } from "../class/ChannelRP";
export class RegisterChannel implements IEvent {

	action: string = "interactionCreate";
	name: string = "Register Channel Intents";

	OnEventFired(client: Client<boolean>, interaction : Interaction): void {
		if(!interaction.isChatInputCommand()) return;

		if(interaction.commandName !== 'register_channel') return;

		ChannelRP.GetChannelRP(interaction.channelId).then(async (chnl) => {
			if(chnl != null){
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

			ChannelRP.RegisterChannelRP(interaction.channelId).then(() => {
				interaction.reply({
					ephemeral : true,
					content : "Succès",
				}).catch(err => {
					console.log(err);
				});
			}).catch((err) => {
				console.log(err)
				interaction.reply({
					ephemeral : true,
					content : "Erreur",
				}).catch(err => {
					console.log(err);
				});
			});

		}).catch((err) => {
			console.log(err)
			interaction.reply({
				ephemeral : true,
				content : "Erreur",
			}).catch(err => {
				console.log(err);
			});
		})
		
	}
}