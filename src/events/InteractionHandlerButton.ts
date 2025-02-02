import { ActionRowBuilder, ButtonInteraction, Client, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, messageLink } from "discord.js";
import { IEvent } from "../class/events/Event";
import * as config from "../config.json"
import { PersoRP } from "../class/PersoRP";

export class InteractionHandlerButton implements IEvent {
	action: string = "interactionCreate";
	name: string = "interactionHandler";
	OnEventFired(client: Client<boolean>, interaction : Interaction): void {
		if(!interaction.isButton()){
			return;
		}
		if(interaction.customId === "register_button"){

			if(!config.channels.includes(interaction.channelId)){
				interaction.reply({
					ephemeral : true,
					content : "Erreur : ce channel n'est pas enregistrer.",
				});
				return;
			}

			let modal = new ModalBuilder()
			.setCustomId("register_perso")
			.setTitle("Enregistrement")
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('name-perso-id').setLabel("Préfixe du grade + Prénom + Nom").setPlaceholder("Agt II. Didier Duchant").setStyle(TextInputStyle.Short)));
			interaction.showModal(modal);
		}else if(interaction.customId === "delete_button"){
			if(!config.channels.includes(interaction.channelId)){
				interaction.reply({
					ephemeral : true,
					content : "Erreur : ce channel n'est pas enregistrer.",
				});
				return;
			}
			
			PersoRP.RemovePersoRP(interaction.channelId, interaction.user.id).catch((err) => {
				interaction.reply({content : "Erreur lors de la supression de votre perso. Prévenez <@232130062529331200>.", ephemeral : true})
			}).then(() => {
				interaction.reply({
					ephemeral : true,
					content : "Succès",
				});
			});
		}
	}
}