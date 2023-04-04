import fse from "fs-extra";

const files = [
  { src: "./.env", dest: "./build/.env" },
  { src: "./package.json", dest: "./build/package.json" },
  { src: "./public", dest: "./build/public" },
];

files.forEach((file) => {
  fse.copySync(file.src, file.dest);
});

fse.removeSync("./build/project-builder.js");
