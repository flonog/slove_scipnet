import { Client, Interaction, Message, messageLink } from "discord.js";
import { IEvent } from "../class/events/Event";
import * as config from "../config.json"
import { ChannelRP } from "../class/ChannelRP";

export class AddButtons implements IEvent {
	action: string = "interactionCreate";
	name: string = "AddButtonsIntents";
	OnEventFired(client: Client<boolean>, interaction : Interaction): void {
		if(!interaction.isChatInputCommand()) return;
		if(interaction.commandName !== 'add_buttons') return;
		
		if(!(interaction.memberPermissions.any("Administrator", true) || config.admin_bot.includes(interaction.user.id))){
			interaction.reply({
				ephemeral : true,
				content : "Vous n'avez pas l'autorisation d'effectuer cette commande.",
			}).catch(err => {
				console.log(err);
			});

			return;
		}

		ChannelRP.GetChannelRP(interaction.channelId).then((chnl) => {

			if(chnl == null){
				interaction.reply({
					ephemeral : true,
					content : "Ce channel n'est pas un channel RP.",
				}).catch(err => {
					console.log(err);
				});
				return;
			}
				
	
			interaction.channel.send({
				"content": "",
				"tts": false,
				"components": [
					{
						"type": 1,
						"components": [
							{
								"style": 3,
								"label": `Formulaire d'enregistrement`,
								"custom_id": `register_button`,
								"disabled": false,
								"type": 2
							},
							{
								"style": 4,
								"label": `Se rétracter du système`,
								"custom_id": `delete_button`,
								"disabled": false,
								"type": 2
							}
						]
					}
					],
				"embeds": [
					{
						"title": `👮 **Bureau d'enregistrement à la  MISS**`,
						"description": `Pour utiliser la **M**essagerie **I**nterne **S**écurisé de la **S**écurité (**MISS**), merci de bien vouloir vous enregistrer.`,
						"color": 0x00FFFF,
						"fields": [
							{
							"name": `**⚠️ Attention**`,
							"value": `- Tout manquement au réglement intérieur de la Zone et au règlement de la sécurité pourra faire l'objet de poursuite. Si vous constatez un manquement aux règlements, contactez votre responsable dans les plus brefs délais. \n- Une fois un message envoyé, il ne peut être ni édité, ni supprimé.`,
							"inline": true
							}
						]
					}
				]
			}).then((message : Message<true>) => {
				message.pin().catch((err) => console.log(err));
			}).catch(err => {
				console.log(err);
			});
	
			interaction.reply({
				ephemeral : true,
				content : "Succès",
			});

		}).catch((err) => {
			
		})
	}

}