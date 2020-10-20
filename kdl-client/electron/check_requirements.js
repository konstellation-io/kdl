const electron = require('electron');
const { exec } = require('child_process');

const commands = {
  k8s: 'kubectl get nodes',
  minikube: 'minikube status',
  helm: 'helm ls'
};

function runCommand(command) {
  return new Promise(resolve => {
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command: "${command}" failed: ${stderr}`, error);
        return resolve(false);
      }
      console.info(`Command: "${command}" output: ${stdout}`);
      resolve(true);
    });
  });
}

electron.ipcMain.on('runCheckRequirement', (event, requirement) => {
  console.log('Running runCheckRequirement IPC...');

  runCommand(commands[requirement])
    .then(result => {
      console.log('Sending checkRequirementsReply...');
      event.sender.send('checkRequirementReply', [requirement, result]);
    });
});
