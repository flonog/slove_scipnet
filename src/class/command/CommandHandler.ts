import { ICommand } from "./Command";

export class CommandHandler {
    public commands: ICommand[] = new Array<ICommand>();

    public RegisterCommand(command: ICommand): void{
        this.commands.push(command);
    }
}