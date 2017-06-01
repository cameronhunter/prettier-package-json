const spawn = require('cross-spawn');

const defaults = {
  stdio: 'pipe'
};

module.exports = (command, args, opts) => {
  const options = Object.assign({}, defaults, opts);
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
    } catch(error) {
      reject({ error });
    }
  });
};
