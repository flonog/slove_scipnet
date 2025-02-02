import { DiscordClient } from "./DiscordClient";

export class PersoRP{
	private _name : string;

	private constructor(name : string){
		this._name = name;
	}

	public getName(): string {
		return this._name;
	}

	public static GetPersoRP(channelId : string, userId : string) : Promise<PersoRP | null> {

		return new Promise((resolve, reject) => {
			let db = DiscordClient.GetSingleton().GetDb();
			
			db.serialize(() => {
				let stmt = db.prepare("SELECT * FROM rp_player WHERE channel_id = ? AND user_id = ?;");
				
				stmt.get(channelId, userId, (err, row) => {
					if(err){
						reject(err);
					}else{
						resolve(row === undefined ? null : new PersoRP(row.name));
					}
				});

				stmt.finalize();
			})
			db.close();
		})
	}

	public static AddPersoRP(channel_id : string, user_id : string, name : string) : Promise<void> {
		return new Promise((resolve, reject) => {
			let db = DiscordClient.GetSingleton().GetDb();
			db.serialize(() => {
				let stmt = db.prepare("INSERT INTO rp_player VALUES(?,?,?);");
				
				stmt.run(user_id, channel_id, name, (err) => {
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
		})
	}

	public static RemovePersoRP(channel_id : string, user_id : string) : Promise<void> {
		return new Promise((resolve, reject) => {
			let db = DiscordClient.GetSingleton().GetDb();
			db.serialize(() => {
				let stmt = db.prepare("DELETE FROM rp_player WHERE channel_id = ? AND user_id = ?;");
				
				stmt.run(channel_id, user_id, (err) => {
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
}