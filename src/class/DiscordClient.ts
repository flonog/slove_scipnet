import {CommandHandler} from "./command/CommandHandler";
import { EventHandler } from "./events/EventHandler";
import { CommandEvent } from "./command/CommandEvent";
import { Client, GatewayIntentBits } from "discord.js";
import { Database } from "sqlite3";

export class DiscordClient {

    public static GetSingleton(): DiscordClient {
        return DiscordClient.singleton;
    }

    private static singleton: DiscordClient;
    private commandHandler: CommandHandler;
    private eventHandler: EventHandler;
    private client: Client | undefined;

    constructor() {
        DiscordClient.singleton = this;
        this.eventHandler = new EventHandler();
        this.commandHandler = new CommandHandler();
    }

    public GetClient() : Client | undefined{
        return this.client;
    }

    public GetDb() : Database {
        return new Database(__dirname + '/../db.sql', (err) => {
            if(err){
                console.log(err);
            }
        });
    }

    public GetCommandHandler(): CommandHandler{
        return this.commandHandler;
    }

    public GetEventHandler(): EventHandler{
        return this.eventHandler;
    }

    private RegisterHandlers(){
        this.eventHandler.RegisterEvent(new CommandEvent());
    }

    public Login(token: string): void {
        this.client = new Client({intents : [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
        this.client.login(token).then(() => {
            console.log("Launched successfuly")
        }).catch((err) => {
            console.log(err);
        });
        this.RegisterHandlers();
    }
}
