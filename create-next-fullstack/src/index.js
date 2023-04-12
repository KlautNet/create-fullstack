#!/usr/bin/env node
const commander = require("commander");
const packageJson = require("../package.json");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const prompts = require("prompts");

const setup = [
  {
    type: "text",
    initial: "my-app",
    name: "projectName",
    message: "What is the name of your project?",
  },
  {
    type: "confirm",
    name: "autoInstall",
    message: "Install packages automatically?",
    initial: true,
  },
  {
    type: "select",
    name: "database",
    message: "Which database should be configured?",
    choices: [
      { title: "PostgreSQL", value: "postgres" },
      { title: "MySQL / MariaDB", value: "mysql" },
      { title: "MongoDB (experimental)", value: "mongodb" },
    ],
  },
];

let projectName, autoInstall, database;
let startTime = Date.now();

/*
 *   Initialize Program
 */

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .usage(`${chalk.green("Create a Fullstack project")}`)
  .action(() => {
    prompts(setup).then((answer) => {
      if (!answer.projectName) {
        console.log("exit");
        process.exit(0);
      }
      projectName = answer.projectName;
      autoInstall = answer.autoInstall;
      database = answer.database;
      createProject();
    });
  })
  .parse(process.argv);

const useYarn = () => {
  try {
    execSync("yarn --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

function appendDependency(packageName, packageVersion) {
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
  packageJson.dependencies[packageName] = packageVersion;
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
}

const createProject = () => {
  const projectDestination = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectDestination)) {
    console.error(
      `[Error] The directory ${chalk.green(projectName)} already exists.`
    );
    process.exit(1);
  }

  fs.copySync(
    path.join(__dirname, "..", program.chakra ? "chakra" : "default"),
    projectName
  );

  const yarn = useYarn();

  /*
   *   Install server dependencies & create .gitignore
   */

  process.chdir(projectDestination + "/server");

  fs.writeFileSync(
    ".gitignore",
    `node_modules 
   dist`
  );

  fs.writeFileSync(
    "src/data-source.ts",
    `
import { DataSource } from "typeorm";
import { Example } from "./entities/Example";

export const AppDataSource = new DataSource({
    type: "${database}",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [Example],
    subscribers: [],
    migrations: [],
})`
  );

  switch (database) {
    case "mongodb":
      appendDependency("mongodb", "^3.6.0");
      break;
    case "postgres":
      appendDependency("pg", "^8.10.0");
      break;
    case "mysql":
      appendDependency("mysql", "^2.18.1");
  }

  if (autoInstall) {
    console.log(chalk.green("Installing server dependencies..."));
    if (yarn) {
      execSync(`yarn install`, {
        //stdio: ["pipe", "pipe", process.stderr]
        stdio: ["pipe"],
      });
    } else {
      execSync(`npm install`, {
        //stdio: ["pipe", "pipe", process.stderr]
        stdio: ["pipe"],
      });
    }
    console.log(chalk.green("Done..."));
  }

  /*
   *   Install web dependencies & create .gitignore
   */

  process.chdir(projectDestination + "/web");

  fs.writeFileSync(
    ".gitignore",
    `# dependencies
/node_modules
  
#next
/.next/
/out/
  
# production
/build
  
# misc
.DS_Store
*.pem
  
# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
  
# local env files
.env*.local
  
# typescript
*.tsbuildinfo
next-env.d.ts`
  );

  if (autoInstall) {
    console.log(chalk.green("Installing web dependencies..."));
    if (yarn) {
      execSync("yarn install", {
        //stdio: ["pipe", "pipe", process.stderr],
        stdio: ["pipe"],
      });
    } else {
      execSync("npm install", {
        //stdio: ["pipe", "pipe", process.stderr]
        stdio: ["pipe"],
      });
    }
    console.log(chalk.green("Installing server dependencies..."));
  }

  console.log();
  console.log();
  console.log(
    chalk.green(`Initialized project in ${(Date.now() - startTime) / 1000}s`) +
      " 🎉"
  );
  console.log();
  console.log();
  console.log(chalk.underline("Next Steps:"));
  console.log();
  console.log(chalk.dim(`cd ${projectName}/server`));
  console.log(
    chalk.dim(
      yarn
        ? `${autoInstall ? "" : "yarn install && "}yarn watch && yarn dev`
        : `${autoInstall ? "" : "npm install && "}npm run watch && npm run dev`
    )
  );
  console.log();
  console.log(chalk.dim(`cd ${projectName}/web`));
  console.log(
    chalk.dim(
      yarn
        ? `${autoInstall ? "" : "yarn install && "}yarn dev`
        : `${autoInstall ? "" : "npm install && "}npm run dev`
    )
  );
  console.log();
};
