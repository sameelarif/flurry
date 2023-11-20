const fs = require("fs");
const path = require("path");
const jsobf = require("javascript-obfuscator");

const blackListedFiles = [
  "obfuscate.js",
  "asarmor.js",
  "devices.json",
  "country_list.js",
  "ua_list.js",
];

const blackListedFolders = [
  "node_modules",
  "build-helpers",
  "lib",
  "dist",
  "main",
  "renderer",
  "store",
  "tasks",
  "ui",
  "static",
];

async function run() {
  // Create array of all files ending in .js
  const jsFiles = await getFilesFromDir("./", [".js"]);

  for (i = 0; i < jsFiles.length; i++) {
    // Obfuscating each file in jsFiles Array
    try {
      console.log("Working on: ", jsFiles[i]);

      let fileData = fs.readFileSync(jsFiles[i], "utf8");

      let obfCode = jsobf.obfuscate(fileData, {
        ignoreRequireImports: true,
        splitStrings: true,
        compact: false,
        controlFlowFlattening: true,
        debugProtection: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        shuffleStringArray: true,
        splitStrings: true,
        stringArrayThreshold: 1,
        optionsPreset: "high-obfuscation",
      });

      let obfCodeData = obfCode.getObfuscatedCode();

      fs.writeFileSync(jsFiles[i], obfCodeData, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Obfuscated: ${jsFiles[i]}`);
        }
      });
    } catch (e) {
      console.log(e, jsFiles[i]);
      return;
    }
  }
}

async function getFilesFromDir(dir, fileTypes) {
  let filesToReturn = [];

  function walkDir(currentPath) {
    let files = fs.readdirSync(currentPath);
    for (let i in files) {
      let curFile = path.join(currentPath, files[i]);
      if (
        fs.statSync(curFile).isFile() &&
        fileTypes.indexOf(path.extname(curFile)) != -1 &&
        checkFileBlackList(curFile)
      ) {
        filesToReturn.push(curFile.replace(dir, ""));
      } else if (
        fs.statSync(curFile).isDirectory() &&
        checkFolderBlackList(curFile)
      ) {
        walkDir(curFile);
      }
    }
  }
  walkDir(dir);
  return filesToReturn;
}

function checkFileBlackList(file) {
  let state = true;

  blackListedFiles.forEach((blacklisted) => {
    if (file.includes(blacklisted)) state = false;
  });

  return state;
}

function checkFolderBlackList(folder) {
  let state = true;

  blackListedFolders.forEach((blacklisted) => {
    if (folder.includes(blacklisted)) state = false;
  });

  return state;
}

run();
