const { exec } = require('child_process');

class Request {
  constructor(event, eventName, command = undefined) {
    this.event = event;
    this.eventName = eventName;
    this.replyEventName = `${eventName}Reply`;
    this.command = command;
  }

  runCommand() {
    return new Promise(resolve => {
      exec(this.command, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Command: "${this.command}" failed: ${stderr}`, error);
          return resolve(false);
        }
        console.info(`Command: "${this.command}" output: ${stdout}`);
        resolve(true);
      });
    });
  }

  reply(response) {
    this.event.sender.send(this.replyEventName, response);
  }

  onData(data) {
    console.log(`stdout: ${data}`);
    this.event.sender.send(this.replyEventName, {
      finished: false,
      text: String(data),
    });
  }

  onError(data) {
    console.error(`stderr: ${data}`);
    this.event.sender.send(this.replyEventName, {
      finished: false,
      text: String(data),
      isError: true,
    });
  }

  onClose(code) {
    const success = code === 0;
  
    console.log(`child process exited with code ${code}`);
    this.event.sender.send(this.replyEventName, {
      // FIXME: set this to success
      success: true,
      finished: true,
      isError: !success,
      text: `child process exited with code ${code}`,
    });
  
    return success;
  }
}

module.exports = Request;
