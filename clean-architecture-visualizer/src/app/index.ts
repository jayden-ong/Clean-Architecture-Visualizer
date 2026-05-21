#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Load package.json synchronously for compatibility with compiled output
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.resolve(__dirname, "../../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

import { AppBuilder } from './appBuilder.js';
import { FileAccess } from '../data_access/fileAccess.js';
import { CleanArchAccess } from '../data_access/cleanArchInfoAccess.js';
import { SessionDBAccess } from "../data_access/sessionDBAccess.js";
import { GraphVerificationController } from '../interface_adapter/graphVerification/graphVerificationController.js';
import { GraphVerificationInteractor } from '../use_case/graphVerification/graphVerificationInteractor.js';
import { startCommand } from "../server/startCommand.js";
import { CreateUseCaseinteractor } from "../use_case/createUseCase/createUseCaseInteractor.js";
import { InitProjectInteractor } from "../use_case/initProject/initProjectInteractor.js";
import { CreateUseCaseController } from "../interface_adapter/createUseCase/createUseCaseController.js";
import { InitProjectContoller } from "../interface_adapter/intiProject/initProjectContoller.js";

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
    await startCommand();
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
    await app.runEndProject();
  })

program.parse(process.argv);
