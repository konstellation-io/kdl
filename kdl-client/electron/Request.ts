import { ExecException, exec } from 'child_process';

import { IpcMainEvent } from 'electron';

export default class Request {
  event: IpcMainEvent;
  eventName: string;
  replyEventName: string;
  command?: string;

  constructor(event: IpcMainEvent, eventName: string, command: string | undefined = undefined) {
    this.event = event;
    this.eventName = eventName;
    this.replyEventName = `${eventName}Reply`;
    this.command = command;
  }

  runCommand() {
    return new Promise((resolve, reject) => {
      if (this.command) {
        exec(this.command, { timeout: 5000 }, (error: ExecException | null, stdout: any, stderr: any) => {
          if (error) {
            console.error(`Command: "${this.command}" failed: ${stderr}`, error);
            reject(error);
          } else {
            console.info(`Command: "${this.command}" output: ${stdout}`);
            resolve(true);
          }
        });
      } else {
        reject('Command execution failed, command is not defined');
      }
    });
  }

  reply(response: any) {
    this.event.sender.send(this.replyEventName, response);
  }

  onData(data: unknown) {
    console.log(`stdout: ${data}`);
    this.event.sender.send(this.replyEventName, {
      finished: false,
      text: String(data),
    });
  }

  onError(data: unknown) {
    console.error(`stderr: ${data}`);
    this.event.sender.send(this.replyEventName, {
      finished: false,
      text: String(data),
      isError: true,
    });
  }

  onClose(code: number) {
    const success = code === 0;

    console.log(`child process exited with code ${code}`);
    this.event.sender.send(this.replyEventName, {
      success,
      finished: true,
      isError: !success,
      text: `child process exited with code ${code}`,
    });

    return success;
  }
}
