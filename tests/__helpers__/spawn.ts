import { spawn } from 'cross-spawn';

const options = { stdio: 'pipe' } as const;

export default function (
  command: string,
  args: string[]
): Promise<{ stdout: string; stderr: string; exitCode: number | null; error?: Error }> {
  return new Promise((resolve, reject) => {
    try {
      const proc = spawn(command, args, options);

      let stdout = '';
      proc.stdout.on('data', (data) => {
        stdout = stdout + data.toString('utf-8');
      });

      let stderr = '';
      proc.stderr.on('data', (data) => {
        stderr = stderr + data.toString('utf-8');
      });

      proc.on('close', (exitCode) => {
        const params = { exitCode, stdout, stderr };
        exitCode === 0 ? resolve(params) : reject(params);
      });

      proc.on('error', (error) => {
        reject({ stdout, stderr, error });
      });
    } catch (error) {
      reject({ error });
    }
  });
}
