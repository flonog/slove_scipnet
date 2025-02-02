import { DiscordClient } from "./class/DiscordClient";
import {REST, Routes, SlashCommandBuilder} from "discord.js";
import * as config from "./config.json";
import { RegisterChannel } from "./events/RegisterChannel"
import { AddButtons } from "./events/AddButtons";
import { CheckMessages } from "./events/CheckMessages";
import { InteractionHandlerButton } from "./events/InteractionHandlerButton";
import { InteractionHandlerForm } from "./events/InteractionHandlerForm";
import { LockChannels } from "./events/LockChannels";

let discordClient = new DiscordClient();

discordClient.Login(process.env.TOKEN);

const commands = [
	{
		name: 'register_channel',
		description: 'Ajoute un Channel RP'
	},
	{
		name: 'add_buttons',
		description: 'Ajoute les bouttons'
	},
	{
		name: 'lock',
		description: 'Verrouille les channels RP'
	},
	{
		name: 'register_webhook',
		description: 'Enregistre un webhook'
	},
	{
		name: 'del_channel',
		description : 'Supprime un channel RP'
	}
];

discordClient.GetEventHandler().RegisterEvent(new RegisterChannel());
discordClient.GetEventHandler().RegisterEvent(new AddButtons());
discordClient.GetEventHandler().RegisterEvent(new CheckMessages());
discordClient.GetEventHandler().RegisterEvent(new InteractionHandlerButton());
discordClient.GetEventHandler().RegisterEvent(new InteractionHandlerForm());
discordClient.GetEventHandler().RegisterEvent(new LockChannels());

let db = discordClient.GetDb();
db.run("CREATE TABLE IF NOT EXISTS rp_player (user_id INT, channel_id TEXT, name TEXT, UNIQUE(user_id, channel_id));");
db.run("CREATE TABLE IF NOT EXISTS rp_channels (channel_id TEXT, UNIQUE(channel_id));");
db.run("CREATE TABLE IF NOT EXISTS rp_webhooks (channel_id TEXT, webhook TEXT, UNIQUE(channel_id, webhook));");
db.run( 'PRAGMA journal_mode = WAL;' );

db.close();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

console.log('Started refreshing application (/) commands.');
  
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
.catch((err) => {
	console.error(err);
}).then(() => {
	console.log('Successfully reloaded application (/) commands.');
});