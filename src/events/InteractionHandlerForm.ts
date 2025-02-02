import { ActionRowBuilder, ButtonInteraction, Client, Interaction, ModalBuilder, TextInputBuilder, messageLink } from "discord.js";
import { IEvent } from "../class/events/Event";
import * as config from "../config.json"
import { PersoRP } from "../class/PersoRP";

export class InteractionHandlerForm implements IEvent {
	action: string = "interactionCreate";
	name: string = "interactionForm";
	OnEventFired(client: Client<boolean>, interaction : Interaction): void {
		if(!interaction.isModalSubmit()){
			return;
		}
		
		if(interaction.customId === "register_perso"){
			let name = interaction.fields.getTextInputValue('name-perso-id');
			if(!config.channels.includes(interaction.channelId)){
				interaction.reply({
					ephemeral : true,
					content : "Erreur : ce channel n'est pas enregistrer.",
				});
				return;
			}
			PersoRP.AddPersoRP(interaction.channelId, interaction.user.id, name).then(() => {
				interaction.reply({
					ephemeral : true,
					content : "Votre demande a été accepté. Bienvenue sur la messagerie interne sécurisée de la sécurité. " + name,
				});
			}).catch((err) => {
				interaction.reply({
					ephemeral : true,
					content : "Vous avez peut être un perso de créer. Supprimez le et recréez en un. En cas de soucis, contactez <@232130062529331200>.",
				});
				console.log(err);
			})
		}
	}
}