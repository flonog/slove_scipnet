import { Client } from "discord.js";

export interface IEvent{
	action : string;
	name : string;

	OnEventFired(client : Client, ...args) : void;
}