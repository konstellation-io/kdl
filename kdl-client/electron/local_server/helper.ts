import {exec, ExecException, spawn} from "child_process";

type ExecResult = {
  stdout: string;
  stderr: string;
}

export function execCommand(cmd: string, timeout: number = 5000): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout }, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({stdout, stderr});
    });
  });
}

export function spawnCommand(cmd: string, onStdout: any, onStderr: any, envVars: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const [execCmd, ...params] = cmd.split(' ');

    const childProcess = spawn(execCmd, params, {env: envVars, shell: true});

    childProcess.stdout.on('data', onStdout);
    childProcess.stderr.on('data', onStderr);
    childProcess.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(`Error executing command "${cmd}", the exit code was: ${code}`)
      }
    });
  });
}
