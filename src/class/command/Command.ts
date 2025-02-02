import { Message } from "discord.js";

export interface ICommand {
    commandName: string;
    aliases: string[];
    description: string;

    OnCommandExecute(message : Message, args : string[]): void;
}
