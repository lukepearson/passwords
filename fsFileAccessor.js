const fs = require('fs');

async function read(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to access file");
  }

  let file;
  try {
    file = fs.readFileSync(path);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to read file");
  }

  return file.toString('utf-8');
}

module.exports = () => ({ read });
