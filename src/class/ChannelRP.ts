import { DiscordClient } from "./DiscordClient";

export class ChannelRP{

	private _channelId : string;

	private constructor(_channelId : string){
		this._channelId = _channelId;
	}
	
	public static RegisterChannelRP(channelId : string) : Promise<void>{
		return new Promise((resolve, reject) => {
			let db = DiscordClient.GetSingleton().GetDb();
			db.serialize(() => {
				let stmt = db.prepare("INSERT INTO rp_channel VALUES(?);");
				
				stmt.run(channelId, (err) => {
					if(err){
						reject(err);
						return;
					}						
					else{
						resolve();
						return;
					}
				});

				stmt.finalize();
			})
			db.close();
		});
	}

	public static RemoveChannelRP(channelId : string) : Promise<void>{
		return new Promise((resolve, reject) => {
			let db = DiscordClient.GetSingleton().GetDb();
			db.serialize(() => {
				let stmt = db.prepare("DELETE FROM rp_channel WHERE channel_id = ?;");
				
				stmt.run(channelId, (err) => {
					if(err)
						reject(err);
					else
						resolve();
					return;
				});

				stmt.finalize();
			})
			db.close();
		})
	}

	public static GetChannelRP(channelId : string) : Promise<ChannelRP | null>{
		return new Promise((resolve, reject) => {
			let db = DiscordClient.GetSingleton().GetDb();
			
			db.serialize(() => {
				let stmt = db.prepare("SELECT * FROM rp_player WHERE channel_id = ?;");
				
				stmt.get(channelId, (err, row : any) => {
					if(err){
						reject(err);
					}else{
						resolve(row === undefined ? null : new ChannelRP(row.name));
					}
				});

				stmt.finalize();
			})
			db.close();
		});
	}

	public AttachWebhook(channelId : string, webhookUrl : string) : Promise<void>{
		return new Promise((resolve, reject) => {
			let db = DiscordClient.GetSingleton().GetDb();
			db.serialize(() => {
				let stmt = db.prepare("INSERT INTO rp_webhooks VALUES(?, ?);");
				
				stmt.run(channelId, webhookUrl, (err) => {
					if(err){
						reject(err);
						return;
					}						
					else{
						resolve();
						return;
					}
				});

				stmt.finalize();
			})
			db.close();
		});
	}

	public RemoveWebhook(channelId : string, webhookUrl : string) : Promise<void>{
		return new Promise((resolve, reject) => {
			let db = DiscordClient.GetSingleton().GetDb();
			db.serialize(() => {
				let stmt = db.prepare("DELETE FROM rp_webhooks WHERE channel_id = ? AND webhook = ?;");
				
				stmt.run(channelId, webhookUrl, (err) => {
					if(err)
						reject(err);
					else
						resolve();
					return;
				});

				stmt.finalize();
			})
			db.close();
		})
	}

	public GetWebhooks(channelId : string) : Promise<string[]>{
		return new Promise((resolve, reject) => {
			return new Promise((resolve, reject) => {
				let db = DiscordClient.GetSingleton().GetDb();
				db.serialize(() => {
					let stmt = db.prepare("SELECT * FROM rp_webhooks WHERE channel_id = ?;");
					
					db.all("SELECT * FROM rp_webhooks WHERE channel_id = ?;", channelId, (err, rows) => {
						if(err)
							reject(err);
						else
							resolve(rows);
						return;
					})
				})
				db.close();
			})
		});
	}
}