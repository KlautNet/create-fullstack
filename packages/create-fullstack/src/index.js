#!/usr/bin/env node
const commander = require("commander");
const packageJson = require("../package.json");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

let projectName;
let startTime = Date.now();

/*
 *   Initialize Program
 */

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")}`)
  .action((name) => {
    projectName = name;
  })
  .option("--chakra", "use chakra ui")
  .parse(process.argv);

if (typeof projectName === "undefined") {
  console.error("[Error] Please specify the project directory:");
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`
  );
  process.exit(1);
}

const projectDestination = path.join(process.cwd(), projectName);

if (fs.existsSync(projectDestination)) {
  console.error(
    `[Error] The directory ${chalk.green(projectName)} already exists.`
  );
  process.exit(1);
}

fs.copySync(
  path.join(__dirname, "../..", program.chakra ? "chakra" : "default"),
  projectName
);

const useYarn = () => {
  try {
    execSync("yarn --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

const yarn = useYarn();

/*
 *   Install server dependencies & create .gitignore
 */

console.log(chalk.green("Installing server dependencies"));

process.chdir(projectDestination + "/server");

fs.writeFileSync(
  ".gitignore",
  `node_modules 
   dist`
);

if (yarn) {
  execSync("yarn install", { stdio: [0, 1, 2] });
} else {
  execSync("npm install", { stdio: [0, 1, 2] });
}

/*
 *   Install web dependencies & create .gitignore
 */

console.log(chalk.green("Installing web dependencies"));

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

if (yarn) {
  execSync("yarn install", { stdio: [0, 1, 2] });
} else {
  execSync("npm install", { stdio: [0, 1, 2] });
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
console.log(chalk.italic(`cd ${projectName}/server`));
console.log(
  chalk.italic(yarn ? "yarn watch && yarn dev" : "npm run watch && npm run dev")
);
console.log();
console.log(chalk.italic(`cd ${projectName}/web`));
console.log(chalk.italic(yarn ? "yarn dev" : "npm run dev"));
console.log();
