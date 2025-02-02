import { DiscordClient } from "../DiscordClient";
import { IEvent } from "./Event";

export class EventHandler{
	public events: IEvent[] = new Array<IEvent>();

	public RegisterEvent(event : IEvent): void{
		console.log(`Registered ${event.name} (${event.action}.)`)
		this.events.push(event);
		const client = DiscordClient.GetSingleton().GetClient();
		client?.on(event.action, event.OnEventFired.bind(null, client))
	}
}