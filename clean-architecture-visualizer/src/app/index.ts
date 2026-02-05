#!/usr/bin/env npx tsx
import { Command } from "commander";
import * as packageJson from "../../package.json" with { type: "json" };
import { sayHello } from "../test.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { exec, spawn, spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JAVA_VIEWER_DIR = path.resolve(__dirname, "../../java-viewer");
const PAYLOAD_PATH = path.join(
  JAVA_VIEWER_DIR,
  "public",
  "cave-java-payload.json",
);
const VIEWER_PORT = 5173;

const program = new Command();

program.version(packageJson.default.version);

program
  .command("say-hello")
  .description("A simple CLI tool to say hello")
  .action(() => {
    sayHello();
  });

program
  .command("init")
  .description("Install java-viewer dependencies (npm install in java-viewer)")
  .action(() => {
    const isWindows = process.platform === "win32";
    const npmCmd = isWindows ? "npm.cmd" : "npm";
    const result = spawnSync(npmCmd, ["install"], {
      cwd: JAVA_VIEWER_DIR,
      stdio: "inherit",
      shell: isWindows,
    });
    if (result.status !== 0) {
      console.error(chalk.red("java-viewer install failed"));
      process.exitCode = 1;
    } else {
      console.log(chalk.green("java-viewer dependencies installed"));
    }
  });

program
  .command("view <filePath>")
  .description(
    "Read a Java file and open it in the React viewer (or print to console with --console)",
  )
  .option(
    "--console",
    "Only print file contents to the terminal (no React app)",
  )
  .action((filePath: string, options: { console?: boolean }) => {
    try {
      const fullPath = path.resolve(filePath);
      const contents = fs.readFileSync(fullPath, "utf-8");

      if (options.console) {
        const consoleHighlighted = contents.replace(
          /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
          (_match: string, functionName: string) => {
            return chalk.cyan(functionName) + "(";
          },
        );
        console.log(consoleHighlighted);
        return;
      }

      // Write payload for React viewer
      const payload = {
        filePath: fullPath,
        content: contents,
        error: null as string | null,
      };
      fs.writeFileSync(PAYLOAD_PATH, JSON.stringify(payload, null, 2));

      // Start React dev server (npm run dev in java-viewer)
      const isWindows = process.platform === "win32";
      const npmCmd = isWindows ? "npm.cmd" : "npm";
      const devProcess = spawn(npmCmd, ["run", "dev"], {
        cwd: JAVA_VIEWER_DIR,
        stdio: "inherit",
        shell: isWindows,
      });

      devProcess.on("error", (err) => {
        console.error(chalk.red("Failed to start Java viewer:"), err.message);
        process.exitCode = 1;
      });

      const openCommand =
        process.platform === "darwin"
          ? "open"
          : process.platform === "win32"
            ? "start"
            : "xdg-open";
      const viewerUrl = `http://localhost:${VIEWER_PORT}`;
      setTimeout(() => {
        exec(`${openCommand} "${viewerUrl}"`, (error) => {
          if (error) {
            console.warn(
              chalk.yellow("Could not open browser. Visit manually:"),
              viewerUrl,
            );
          } else {
            console.log(chalk.green("Java viewer opened at"), viewerUrl);
          }
        });
      }, 2500);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error reading file: ${error.message}`);
      } else {
        console.error("An unknown error occurred");
      }
      process.exitCode = 1;
    }
  });

const DEFAULT_STRUCTURE = ["parent-folder", "child-folder"];

program
  .command("create-project <filePath>")
  .description(
    "Create a nested directory structure at the given path (parent-folder/child-folder)",
  )
  .action((filePath: string) => {
    try {
      const rootPath = path.resolve(filePath);
      const fullPath = path.join(rootPath, ...DEFAULT_STRUCTURE);
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(chalk.green("Created:"), fullPath);
      const parentPath = path.join(rootPath, DEFAULT_STRUCTURE[0]!);
      console.log(chalk.dim("  " + parentPath));
      console.log(chalk.dim("  " + fullPath));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red("Error creating project:"), error.message);
      } else {
        console.error("An unknown error occurred");
      }
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
