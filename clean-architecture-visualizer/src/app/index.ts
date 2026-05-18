#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Load package.json synchronously for compatibility with compiled output
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.resolve(__dirname, "../../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const frontendPathFromSource = path.resolve(__dirname, "../../frontend");
const frontendPathFromDist = path.resolve(__dirname, "../../../frontend");
const FRONTEND_DIR = fs.existsSync(frontendPathFromSource)
  ? frontendPathFromSource
  : frontendPathFromDist;

const API_PORT = 3131;
import { AppBuilder } from './appBuilder.js';
import { FileAccess } from '../data_access/fileAccess.js';
import { CleanArchAccess } from '../data_access/cleanArchInfoAccess.js';
import { SessionDBAccess } from "../data_access/sessionDBAccess.js";
import { GraphVerificationController } from '../interface_adapter/graphVerification/graphVerificationController.js';
import { GraphVerificationInteractor } from '../use_case/graphVerification/graphVerificationInteractor.js';
import { startServer } from "../server/server.js";
import { CreateUseCaseInteractor } from "../use_case/createUseCase/createUseCaseInteractor.js";
import { InitProjectInteractor } from "../use_case/initProject/initProjectInteractor.js";
import { CreateUseCaseController } from "../interface_adapter/createUseCase/createUseCaseController.js";
import { InitProjectContoller } from "../interface_adapter/intiProject/initProjectContoller.js";
import { exec, spawn } from "child_process";
import chalk from "chalk";

const program = new Command();

const app = new AppBuilder()
  .withFileAccess(new FileAccess())
  .withCleanArchAccess(new CleanArchAccess())
  .withSessionDBAccess(new SessionDBAccess())
  .buildGraphVerificationInteractor(GraphVerificationInteractor)
  .buildCreateUseCaseInteractor()
  .buildInitProjectInteractor(InitProjectInteractor)
  .buildGraphVerificationController(GraphVerificationController)
  .buildCreateUseCaseController(CreateUseCaseController)
  .buildInitProjectController(InitProjectContoller)

program.version(packageJson.version);

program
  .command('start')
  .description('Start backend server and frontend dev server')
  .action(async () => {
    app.runGraphVerification();
    const backendServer = startServer();

    const isWindows = process.platform === "win32";
    const npmCmd = isWindows ? "npm.cmd" : "npm";

    const devProcess = spawn(npmCmd, ["run", "dev:backend"], {
      cwd: FRONTEND_DIR,
      stdio: "inherit",
      shell: isWindows,
      windowsHide: true,
    });

    let openTimer: NodeJS.Timeout;

    devProcess.on("error", (err) => {
      console.error(chalk.red("CRITICAL: Failed to start frontend:"), err.message);
      if (openTimer) clearTimeout(openTimer);
      shutdown("INTERNAL_ERROR"); 
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

      if (signal !== "INTERNAL_ERROR") {
        console.log(chalk.dim(`\nReceived ${signal}. Shutting down...`));
      }
      
      closeFrontend();

      const forceExitTimer = setTimeout(() => {
        process.exit(1);
      }, 3000);

      backendServer.close(() => {
        clearTimeout(forceExitTimer);
        process.exit(signal === "INTERNAL_ERROR" ? 1 : 0);
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));

    const openCommand =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
          ? "cmd /c start \"\""
          : "xdg-open";
    const appUrl = `http://localhost:${API_PORT}`;

    openTimer = setTimeout(() => {
      if (!shutdownStarted) { // Only open if we haven't crashed
        exec(`${openCommand} "${appUrl}"`, (error) => {
          if (error) {
            console.warn(chalk.yellow("Could not open browser. Visit manually:"), appUrl);
          } else {
            console.log(chalk.green("App opened at"), appUrl);
          }
        });
      }
    }, 2500);
  });

program
  .command('verify')
  .description('Verify whether the use cases found in child directories adhere to Clean Architeccture')
  .action(async() => {
    app.runCLIGraphVerification();
  })

program
  .command('init')
  .description('Create the template for a new CSC207 project')
  .action(async() => {
    app.runInitProject();
  })

program
  .command('usecase <name>')
  .description('Create the template for a new use case')
  .action(async(name: string) => {
    app.runCreateUseCase(name);
  })

program
  .command('end')
  .description('Close the express server and clean the tempdir')
  .action(async() => {
    
  })

program.parse(process.argv);