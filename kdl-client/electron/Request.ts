import { IpcMainEvent } from 'electron';

export default class Request {
  event: IpcMainEvent;
  eventName: string;
  replyEventName: string;
  command?: string;

  constructor(event: IpcMainEvent, eventName: string) {
    this.event = event;
    this.eventName = eventName;
    this.replyEventName = `${eventName}Reply`;
  }

  reply(response: any) {
    this.event.sender.send(this.replyEventName, response);
  }

  notifyError(msg: string) {
    this.event.sender.send('mainProcessError', msg);
  }
}
