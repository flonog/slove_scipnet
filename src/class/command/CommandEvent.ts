import { ChannelType, Client, Message } from "discord.js";
import { DiscordClient } from "../DiscordClient";
import {IEvent} from "../events/Event";

export class CommandEvent implements IEvent {

	action = "message";
	name = "CommandHandler";

	OnEventFired(client: Client, message : Message): void {
		if(message.author.bot)
			return;

		if(message.channel.type == ChannelType.DM)
			return;
		
		if(!message.content.startsWith("!"))
			return;

		let args = message.content.slice(1).split(" ");
		const commandHandler = DiscordClient.GetSingleton().GetCommandHandler();
		const command = commandHandler.commands.find((command) => {
			return command.aliases.find(aliases => aliases == args[0]);
		})
		if(!command)
			return;
		args = args.slice(1);

		command.OnCommandExecute(message, args)
		message.delete().catch((err) => {
			console.error(err);
		})
	}
}