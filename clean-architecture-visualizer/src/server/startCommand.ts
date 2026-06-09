import { exec, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';

import { startServer } from './server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPathFromSource = path.resolve(__dirname, '../../frontend');
const frontendPathFromDist = path.resolve(__dirname, '../../../frontend');
const FRONTEND_DIR = fs.existsSync(frontendPathFromSource)
  ? frontendPathFromSource
  : frontendPathFromDist;

const API_PORT = 3131;

export async function startCommand(): Promise<void> {
  const backendServer = startServer();

  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';

  const devProcess = spawn(npmCmd, ['run', 'dev:backend'], {
    cwd: FRONTEND_DIR,
    stdio: 'inherit',
    shell: isWindows,
    windowsHide: true,
  });

  let openTimer: NodeJS.Timeout;

  devProcess.on('error', (err) => {
    console.error(
      chalk.red('CRITICAL: Failed to start frontend:'),
      err.message
    );
    if (openTimer) clearTimeout(openTimer);
    shutdown('INTERNAL_ERROR');
  });

  const closeFrontend = () => {
    if (devProcess && !devProcess.killed) {
      devProcess.kill();
    }
  };

  let shutdownStarted = false;
  const shutdown = (signal: string) => {
    if (shutdownStarted) return;
    shutdownStarted = true;

    if (signal !== 'INTERNAL_ERROR') {
      console.log(chalk.dim(`\nReceived ${signal}. Shutting down...`));
    }

    closeFrontend();

    const forceExitTimer = setTimeout(() => {
      process.exit(1);
    }, 3000);

    backendServer.close(() => {
      clearTimeout(forceExitTimer);
      process.exit(signal === 'INTERNAL_ERROR' ? 1 : 0);
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));

  const openCommand =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'cmd /c start ""'
        : 'xdg-open';
  const appUrl = `http://localhost:${API_PORT}`;

  openTimer = setTimeout(() => {
    if (!shutdownStarted) {
      exec(`${openCommand} "${appUrl}"`, (error) => {
        if (error) {
          console.warn(
            chalk.yellow('Could not open browser. Visit manually:'),
            appUrl
          );
        } else {
          console.log(chalk.green('App opened at'), appUrl);
        }
      });
    }
  }, 2500);
}
